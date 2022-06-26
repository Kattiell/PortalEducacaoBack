const express = require("express");
const UserControler = require("../controllers/admin/UserControler");
const routes = express.Router()
const defaultcontroller = require("./../controllers/DefautController");

routes.get("/",(req,res) => {
    return res.send("Funcionando.");
})

routes.get("/init", defaultcontroller.Administrador);



module.exports = routes