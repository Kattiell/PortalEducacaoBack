const { app } = require('firebase-admin')
const {alunocolec} = require('./../firebase')


// Valida se os campos foram preenchidos ou não
const VerificaCamposVazios = (dados) => {
    let reco = []

    dados.forEach((valor, index, array) => {
        if (!valor.dado || valor.dado === undefined || valor.dado === null) {
            reco.push(`Campo ${valor.chave} vazio, favor preencher`)
        }
    })
    return reco;
}

// Valida se os campos atendem os campos mínimos e máximos de caracteres
const VerificarTamanho = (dados) => {
    let reco = []

    dados.forEach((valor, index, array) => {
        var maximo = valor.max
        if (valor.max === undefined) maximo = 30
        if (valor.dado.length < valor.min || valor.dado.length > maximo) {
            reco.push(`Campo ${valor.chave} possui a quantidade de caracteres errada`)
        }
    })
    return reco;
}

// Valida se os campos com valores padrão foram preenchidos
const VerificarValoresPadrão = (dados) => {
    let reco = [];
    
    dados.forEach((valor,index,array)=>{
        if(valor.dado == 'Escolha uma opção: ' || valor.dado == 'Selecione o ensino' || valor.dado == 'Selecione o sexo' || valor.dado == 'Selecione a disciplina'){
            reco.push(`Campo ${valor.chave} vazio, favor preencer`);
            
        }
    })
    return reco;
}

const VerificarExistencia = (dados) =>{
    let reco = []

    dados.forEach((valor, index, array) => {

    })
}

module.exports = {
    async CadastroEscola(req, res, next) {
        const {
            nome,
            endereco,
            telefone,
            ensinotrabalhado
        } = req.body;
        var CamposVaziosResultado = VerificaCamposVazios([
            {
                dado: nome,
                chave: 'nome'
            },
            {
                dado: endereco,
                chave: 'endereco'
            },
            {
                dado: telefone,
                chave: 'telefone'
            },
            {
                dado: ensinotrabalhado,
                chave: 'ensino trabalhado'
            },
        ]);
        var VerificaTamanhoResultado = VerificarTamanho([
            {
                dado: nome,
                max: 30,
                min: 3,
                chave: 'nome'
            },
            {
                dado: telefone,
                max: 11,
                min: 11,
                chave: 'telefone'
            },
            {
                dado: endereco,
                max: 60,
                min: 10,
                chave: 'endereco'
            },
            {
                dado: ensinotrabalhado,
                max: 20,
                min: 10,
                chave: 'ensino trabalhado'
            },
        ]);
        var ValoresPadrao = VerificarValoresPadrão([
            {
                dado: ensinotrabalhado,
                chave: 'ensino trabalhado'
            },
        ])

        if (CamposVaziosResultado.length > 0) {
            return res.status(400).send({msg: "Erro com os dados",error: CamposVaziosResultado});
        }else if (VerificaTamanhoResultado.length > 0) {
            return res.status(400).send({msg: "Erro com os dados",error: VerificaTamanhoResultado})
        } else if(ValoresPadrao.length > 0){
            return res.status(400).send({msg: "Erro com os dados",error: ValoresPadrao})
        }else {
            return next();
        }
    },

    async CadastroProf(req, res, next) {
        const {
            nome,
            telefone,
            endereco,
            formacao,
            ensinotrabalhado,
            datadenascimento,
            disciplinaatrabalhar,
            sexo,
            email,
        } = req.body;

        var CamposVaziosResultado = VerificaCamposVazios([
            {
                dado: nome,
                chave: 'Nome'
            },
            {
                dado: endereco,
                chave: 'Endereço'
            },
            {
                dado: telefone,
                chave: 'Telefone'
            },
            {
                dado: formacao,
                chave: 'Formação Acadêmica'
            },
            {
                dado: disciplinaatrabalhar,
                chave: 'Disciplina a trabalhar'
            },
            {
              dado: sexo,
              chave: 'Sexo'
            },
            {
                dado:datadenascimento,
                chave: "Data de Nascimento"
            },
            {
                dado: ensinotrabalhado,
                chave : "Ensino a trabalhar"
            },
            {
                dado: email,
                chave : "E-mail"
            }

        ])
        var VerificaTamanhoResultado = VerificarTamanho([
            {
                dado: nome,
                max: 30,
                min: 3,
                chave: 'Nome'
            },
            {
                dado: telefone,
                max: 11,
                min: 11,
                chave: 'Telefone'
            },
            {
                dado: endereco,
                max: 60,
                min: 10,
                chave: 'Endereço'
            },
            {
                dado: formacao,
                max: 50,
                min: 10,
                chave: 'Formação Acadêmica'
            },
            {
                dado: disciplinaatrabalhar,
                max: 40,
                min: 4,
                chave: 'Disciplina a trabalhar'
            },
            {
                dado: sexo,
                max: 30,
                min: 4,
                chave: 'Sexo'

            },
            {
                dado: datadenascimento, 
                max: 14,
                min: 6,
                chave: "Data de Nascimento"
            },
            {
                dado: ensinotrabalhado,
                max: 50,
                min: 12,
                chave: "Ensino a trabalhar"
            },
            {
                dado: email,
                max:150,
                min:12,
                chave: "E-mail"
            }
        ])

        var VerificarPadrao = VerificarValoresPadrão([
            {
                dado: ensinotrabalhado,
                chave : "Ensino a trabalhar"
            },
            {
                dado: sexo,
                chave: 'Sexo'
            },
            {
                dado: disciplinaatrabalhar,
                chave: 'Disciplina a trabalhar'
            },
        ])

        if (CamposVaziosResultado.length > 0) {
            return res.status(400).send({msg: 'Erro com os dados',error: CamposVaziosResultado});
        } else if (VerificaTamanhoResultado.length > 0) {
            return res.status(400).send({msg: 'Erro com os dados',error: VerificaTamanhoResultado});
        } else if(VerificarPadrao.length > 0){
            return res.status(400).send({msg: 'Erro com os dados',error: VerificarPadrao});
        }
        else {
            return next();
        }
    },
    async CadastroAluno(req, res, next) {
        const {
            nomedoaluno,
            telefone,
            endereco,
            email,
            datadenascimento,
            turma,
            nomedoresponsavel,
            cpfresponsavel,
            sexo
        } = req.body;

        var CamposVaziosResultado = VerificaCamposVazios([
            {
                dado: nomedoaluno,
                chave: 'nome do aluno'
            },
            {
                dado: endereco,
                chave: 'endereco'
            },
            {
                dado: telefone,
                chave: 'telefone'
            },
            {
                dado: turma,
                chave: 'turma'
            },
            {
                dado: nomedoresponsavel,
                chave: 'nome do responsavel'
            },
            {
                dado: cpfresponsavel,
                chave: 'cpf do resposavel'
            },
            {
                dado: sexo,
                chave: 'sexo'
            }
        ])
        var VerificaTamanhoResultado = VerificarTamanho([
            {
                dado: nomedoaluno,
                max: 30,
                min: 3,
                chave: 'nomedoaluno'
            },
            {
                dado: telefone,
                max: 16,
                min: 11,
                chave: 'telefone'
            },
            {
                dado: endereco,
                max: 60,
                min: 10,
                chave: 'endereco'
            },
            {
                dado: email,
                max: 40,
                min: 10,
                chave: 'email'
            },
            {
                dado: datadenascimento,
                max: 20,
                min: 6,
                chave: 'datadenascimento'
            },
            {
                dado: turma,
                max: 20,
                min: 3,
                chave: 'turma'
            },
            {
                dado: nomedoresponsavel,
                max: 20,
                min: 3,
                chave: 'nomedoresponsavel'
            },
            {
                dado: cpfresponsavel,
                max: 20,
                min: 13,
                chave: 'cpfresponsavel'
            },
            {
                dado: sexo,
                max: 15,
                min: 4,
                chave: 'sexo'
            }
        ])
        if (CamposVaziosResultado.length > 0) {
            return res.status(400).send({
                msg: "Erro com os dados",
                error: CamposVaziosResultado
            })
        } else if (VerificaTamanhoResultado.length > 0) {
            return res.status(400).send({
                msg: "Erro com os dados",
                error: VerificaTamanhoResultado
            })
        }
        else {
            return next();
        }
    },

    async CadastroTurma(req, res, next) {
        const {
            numeroTurma,
            ensino,
            horarios,
        } = req.body;
        var CamposVaziosResultado = VerificaCamposVazios([
            {
                dado: numeroTurma,
                chave: 'Nome Turma'
            },
            {
                dado: ensino,
                chave: 'Ensino'
            },
        ])
        var VerificaTamanhoResultado = VerificarTamanho([
            {
                dado: numeroTurma,
                max: 10,
                min: 3,
                chave: 'numeroTurma'
            },
            {
                dado: ensino,
                max: 50,
                min: 10,
                chave: 'ensino'
            },
        ])
        if (CamposVaziosResultado.length > 0) {
            return res.send({
                msg: "Erro com os dados",
                error: CamposVaziosResultado
            });
        } else if (VerificaTamanhoResultado.length > 0) {
            return res.send({
                msg: "Erro com os dados",
                error: VerificaTamanhoResultado
            })
        }
        else {
            return next();
        }
    },




};
