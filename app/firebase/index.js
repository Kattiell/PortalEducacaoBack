const { initializeApp } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const { getAuth} = require('firebase-admin/auth');

var admin = require("firebase-admin");

var serviceAccount = require("./../../chaveportal.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://portaeducacao-default-rtdb.firebaseio.com"
});

const db = getFirestore();
const userscolec = db.collection('users');
const admincolec = db.collection('admin');
const escolacolec = db.collection('escola');
const profcolec = db.collection('professor');
const alunocolec = db.collection('aluno');

const turmacolec = db.collection('turmas');

const auth = getAuth();

module.exports = {
    auth,
    userscolec,
    admincolec,
    escolacolec,
    profcolec,
    alunocolec,
    turmacolec,
    db,
}