const nodemailer = require("nodemailer");

const user = "projeteduca5pi@gmail.com";
const pass = "jilisqvgvsgryyjz";


module.exports = {


    async SendMail(req,res){

        const { destinatario, assunto, mensagem} = req.body;

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{user,pass},
        })

        transporter.sendMail({
            from: user,
            to: destinatario,
            subject: assunto,
            text: mensagem,

        }).then(
            info =>{
                res.send("email enviado com sucesso");
            }
        )

    },


    async SendMailNoRequest(destinatarioEmail,assuntoEmail,mensagemEmail){
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{user,pass},
        })

        transporter.sendMail({
            from: user,
            to: destinatarioEmail,
            subject: assuntoEmail,
            text: mensagemEmail,

        })

    }

};