const express = require("express");
const fs = require("fs");
var ip = require('ip');

const app = express();

const defaultroutes = require("./app/routers/default");
const adminroutes = require("./app/routers/admin");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(defaultroutes);
app.use(adminroutes);


// Retorna IPV4
const ipAddress = ip.address();
app.listen(3000, ipAddress);
console.log("App Rodando no endereço:", ipAddress);

// Cria o arquivo com o IPV4
fs.access("./ipv4.json", (err) => {
    if (err) {
        fs.appendFile("ipv4.json", "{\"ip\":\"" + ipAddress + "\"}", function (err) {
            if (err) throw err;
            console.log("Arquivo criado");
        });
    } else console.log("Arquivo já existe");
});

