
const { query } = require("express");
const { CadastroProf } = require("../../middleware/MiddValidator");
const { cripto, decripto } = require("../../services/cripto/cripto");
const { escolacolec, userscolec, profcolec, alunocolec, auth, turmacolec } = require("./../../firebase");
const EmailController = require("./EmailController");
const SendMail = require("./EmailController");

const GeneratePass = () => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const calpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = '1234567890';
    const specials = ',.!@#$%^&';
    const options = [alpha, alpha, alpha, calpha, calpha, num, num, specials, alpha, alpha, alpha, calpha, calpha, num, num, specials];
    let opt, choose;
    let pass = "";
    for (let i = 0; i < 16; i++) {
        opt = Math.floor(Math.random() * options.length);
        choose = Math.floor(Math.random() * (options[opt].length));
        pass = pass + options[opt][choose];
        options.splice(opt, 1);
    }
    return pass;
} //Gerador de Senha aleatorio para aluno e professor


module.exports = {
    async CadastroEscola(req, res) {

        const {
            nome,
            endereco,
            telefone,
            ensinotrabalhado
        } = req.body;

        const escola = await escolacolec.where('nome', '==', nome).get();

        if (escola.empty) {
            await escolacolec.doc(nome).set({
                nome: nome,
                telefone: telefone,
                endereco: endereco,
                ensinotrabalhado: ensinotrabalhado
            }).then((escola) => {
                return res.send({
                    msg: "deu certo!",
                    escola: {
                        id: escola._path.segments[1],
                        nome: nome,
                        telefone: telefone,
                        endereco: endereco,
                        ensinotrabalhado: ensinotrabalhado
                    }
                });
            }).catch((err) => {
                return res.send({
                    msg: "Erro ao efetuar a criação da escola.",
                    error: err
                })
            });
        } else {
            return res.send({
                msg: "Erro ao efetuar a criação da escola.",
            })
        }

    },

    async CadastroProf(req, res) {
        const {
            nome,
            telefone,
            endereco,
            formacao,
            ensinotrabalhado,
            datadenascimento,
            disciplinaatrabalhar,
            email,
            sexo,
            escola,
        } = req.body;

        const pass = GeneratePass();

        await auth.createUser({
            email: email,
            password: pass,
            emailVerified: true,
        }).then(async (auth) => {
            const user = await userscolec.add({
                email: email,
                authid: auth.uid,
                address: endereco,
                telefone: telefone,//pra chamar o numero de telefone na users e identificar na auth do sms
                role: 'prof',
            });
            await profcolec.add({
                userid: user.id,
                nome: nome,
                telefone: telefone,
                endereco: endereco,
                formacao: formacao,
                ensinotrabalhado: ensinotrabalhado,
                datadenascimento: datadenascimento,
                disciplinaatrabalhar: disciplinaatrabalhar,
                sexo: sexo,
                escola: escola,
            },
                EmailController.SendMailNoRequest(email, "Suas credenciais de acesso.",
                    "Prezado professor(a), seu cadastro no APP Portal Educação foi realizado!\nPara realizar seu primeiro acesso basta acessar o aplicativo com seu email e senha: " + pass));
            return res.send({
                msg: 'Professor criado com sucesso',
            });
        }).catch((err) => {
            return res.send({
                msg: 'erro',
                error: err

            });
        });

    },


    async CadastroAluno(req, res) { //Cadastra um Aluno autenticado
        const {
            nomedoaluno,
            telefone,
            endereco,
            email,
            datadenascimento,
            turma,
            nomedoresponsavel,
            cpfresponsavel,
            sexo,
            escola,

        } = req.body;

        const pass = GeneratePass();

        await auth.createUser({
            email: email,
            password: pass,
            emailVerified: true
        }).then(async (auth) => {
            const user = await userscolec.add({
                email: email,
                authid: auth.uid,
                address: endereco, // Endereço encriptado
                telefone: telefone, //pra chamar o numero de telefone na users e identificar na auth do sms
                role: 'aluno'
            });
            await alunocolec.add({
                userid: user.id,
                telefone: cripto(telefone), // Telefone encriptado
                turma: turma,
                datadenascimento: cripto(datadenascimento), // Data de nascimento encriptada
                sexo: sexo,
                nomedoaluno: cripto(nomedoaluno), // Nome do aluno encriptado
                cpfresponsavel: cpfresponsavel,
                nomedoresponsavel: nomedoresponsavel,
                escola: escola
            });
            EmailController.SendMailNoRequest(email, "Suas credenciais de acesso.",
                "Caro estudante, seu cadastro no APP Portal Educação foi realizado!\nPara realizar seu primeiro acesso basta acessar o aplicativo com seu email e senha: " + pass);
            return res.send({
                msg: 'Aluno criado com sucesso',
            });
        }).catch((err) => {
            return res.status(400).send({
                msg: 'erro',
                error: err

            });
        });

    },

    async GetAluno(req, res) {
        const {
            nomedoaluno
        } = req.body;

        let aluno = await alunocolec.where('nomedoaluno', '==', nomedoaluno).get();
        aluno.docs[0]["_fieldsProto"]["telefone"]["stringValue"] = decripto(aluno.docs[0]["_fieldsProto"]["telefone"]["stringValue"]);
        aluno.docs[0]["_fieldsProto"]["nomedoaluno"]["stringValue"] = decripto(aluno.docs[0]["_fieldsProto"]["nomedoaluno"]["stringValue"]);
        aluno.docs[0]["_fieldsProto"]["datadenascimento"]["stringValue"] = decripto(aluno.docs[0]["_fieldsProto"]["datadenascimento"]["stringValue"]);
        res.send(aluno.docs[0]["_fieldsProto"]);
    },

    async GetAlunoById(req,res){
        const id = req.params.id;
        try {
            var usuario = await (await userscolec.where('authid','==',id).get()).docs[0]["_ref"]["_path"]["segments"][1];
            var aluno = await (await alunocolec.where('userid','==',usuario).get()).docs[0]["_fieldsProto"];
        } catch (error) {
            console.log(error)
        }

        aluno["nomedoaluno"]["stringValue"] = decripto(aluno["nomedoaluno"]["stringValue"]);

        res.send(aluno);
    },

    async CadastroTurmas(req, res) {
        const {
            ensino,
            numeroTurma,
            horarios,
            escola,
        } = req.body;
        await turmacolec.doc(numeroTurma).set({
            numeroTurma: numeroTurma,
            ensino: ensino,
            horarios: horarios,
            escola: escola,
        }).then((turmas) => {
            return res.send({
                msg: "deu certo!",
                turma: {
                    //id: turmas._path.segments[1],
                    numeroTurma,
                    ensino,
                    horarios,
                    escola
                }
            });
        }).catch((err) => {
            return res.send({
                msg: "Erro ao efetuar a criação da Turma.",
                error: err
            })
        });
    },

    async GetProfessores(req, res) {
        const professor = await profcolec.get();
        res.send(professor.docs.map(doc => doc.get('nome')));
    },

    async GetProfessoresInfo(req, res) {
        const professor = await profcolec.get();
        res.send(professor.docs.map(doc => doc.data()));
    },

    async GetProfessorSpecific(req,res){
        const id = req.params.id;
        try {
            var usuario = await (await userscolec.where('authid','==',id).get()).docs[0]["_ref"]["_path"]["segments"][1];
            var professor = await (await profcolec.where('userid','==',usuario).get()).docs[0]["_fieldsProto"];
        } catch (error) {
            console.log(error)
        }
       
        res.send(professor);
      
    },

    async GetProfessoresH(req, res) {
        const { nome } = req.body;
        let horario;
        let professor;
        try {
          professor = await profcolec.where('nome', '==', nome).get();
        } catch (error) {
            console.log("Não encontrado")
        }
        const h = professor.docs[0].get('horarios');
        res.send(h);
    },


    async GetTurmas(req, res) {

        const ref = turmacolec;
        const snapshot = await ref.get();
        let list = [];
        snapshot.forEach(doc => {
            list.push(doc.data());
        });
        res.send(list);
    },

    // Retorna horários de uma turma específica
    async getTurmaSpecific(req, res) {
        const n = req.body.nTurma;
        const ref = await turmacolec.get();
        const t = await turmacolec.where('numeroTurma', '==', n).get()
        res.send(t.docs[0].get('horarios'))

    },

    // Retorna uma lista de escolas cadastradas
    async GetEscola(req, res) {
        const escola = await escolacolec.get();
        res.send(escola.docs.map(doc => doc.get('nome')));
    },


    async EditHorarioTurmas(req, res) {
        const {
            ensino,
            numeroTurma,
            horarios,
            escola,
        } = req.body;


        await turmacolec.doc(numeroTurma).set({
            ensino: ensino,
            escola: escola,
            horarios: horarios,
            numeroTurma: numeroTurma,
        }, { merge: true }).then(
            res.status(200).send(),
        ).catch((err) => {

            console.log(err);

        });

    },


    async CadastroHorariosProf(req, res) {
        const {
            horarios,
            nome,
        } = req.body;

        // Obtem o Id do professor
        const prof = await profcolec.where('nome', '==', nome).get();
        let profId = prof.docs[0]["_ref"]["_path"]["segments"][1];

        // Insere a grade de horários do professor
        const profRef = profcolec.doc(profId);
        await profRef.update({ horarios: horarios }).then(
            res.status(201).send("Horário cadastrado com sucesso")
        );


    },


    async GetUserRole(req, res) {
        const { userid } = req.body;
        console.log("O id que está vindo do front é: " + userid);
        const user = await userscolec.where('authid', '==', userid).get();
        res.send(user.docs[0]['_fieldsProto']['role'].stringValue);
    },

    async PutCodeAuth(req,res){
        const { authid } = req.body;
        let code = await userscolec.where('authid', '==', authid).get();
        code = await code.docs[0]['_fieldsProto']['telefone'].stringValue;

        const num = '1234567890';
        const options = [ num, num, num, num, num, num];
        let opt, choose;
        let cod = "";
        for (let i = 0; i < 6; i++) {
            opt = Math.floor(Math.random() * options.length);
            choose = Math.floor(Math.random() * (options[opt].length));
            cod = cod + options[opt][choose];
            options.splice(opt, 1);
        }
        console.log("Código é: "+ cod);

        const accountSid = 'AC9450580598ba937d237601a7e73a04f2';
        const authToken = '45ce313f3f3541f53fa938b57f4c7d16';
        const client = require('twilio')(accountSid, authToken);

        console.log("SMS sendo enviado!!")
        await client.messages
            .create({
                body: 'Caro usuário, seu código para autenticação no Portal Educação é: ' + cod +".",
                from: '+19403531688',
                to: '+55' + code,
            })
            .then(message => console.log(message.sid))
            .catch(error => console.log(error));

            res.send({
                code: cod,
            })

    },

       
    async GetDisciplina(req,res){

    },

    async GetCodeAuth(req,res){

    },

    async Teste(req,res){
        fetch()
    }



}