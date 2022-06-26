const express = require("express");
const { route } = require("./default");
const routes = express.Router()
const UserControler = require("./../controllers/admin/UserControler");
const MiddValidator = require ("./../middleware/MiddValidator");
const EmailController = require("../controllers/admin/EmailController");

// POST's
routes.post("/professores", MiddValidator.CadastroProf, UserControler.CadastroProf );
routes.post("/alunos", MiddValidator.CadastroAluno, UserControler.CadastroAluno );
routes.post("/escola", MiddValidator.CadastroEscola, UserControler.CadastroEscola );
routes.post('/turmas', MiddValidator.CadastroTurma,UserControler.CadastroTurmas);
routes.post("/turma",UserControler.getTurmaSpecific);
routes.post("/horario-professor",UserControler.CadastroHorariosProf);
routes.post("/professor-horario",UserControler.GetProfessoresH);
routes.post("/role",UserControler.GetUserRole);
routes.post('/aluno',UserControler.GetAluno);
routes.post('/code',UserControler.PutCodeAuth);


// GET's 

routes.get("/professores",UserControler.GetProfessores);
routes.get("/turmas",UserControler.GetTurmas);
routes.get("/escola",UserControler.GetEscola);
routes.get("/profInfo",UserControler.GetProfessoresInfo);
routes.get("/professor:id",UserControler.GetProfessorSpecific);
routes.get("/aluno:id",UserControler.GetAlunoById);
routes.get("/which-class",UserControler.GetDisciplina);
routes.get("/send-email",EmailController.SendMail); // Disparo de email

// PUT's
routes.put("/turmas",UserControler.EditHorarioTurmas);

module.exports = routes