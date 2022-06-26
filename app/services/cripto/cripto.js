var crypto = require('crypto');
// Chave {key} aleatória
let secret = 'hexadecimalhexadecimalhexadecima';
// iv
const iv = 	Buffer.from([29102001,0,0,7,47,1,1,777,847,4,4,7,7,147,001,110]);
// Encriptador
var cipher = crypto.createCipheriv('aes-256-ctr',secret,iv);
var decipher = crypto.createDecipheriv('aes-256-ctr',secret,iv);

function cripto(stringTarget){

    cipher = crypto.createCipheriv('aes-256-ctr',secret,iv);
    decipher = crypto.createDecipheriv('aes-256-ctr',secret,iv);

    let encrypted = cipher.update(stringTarget,'utf-8','hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decripto(encrypted){

    cipher = crypto.createCipheriv('aes-256-ctr',secret,iv);
    decipher = crypto.createDecipheriv('aes-256-ctr',secret,iv);

    let enc = encrypted.split(':');
    let ivb = Buffer.from(enc.shift(), 'hex');
    let encryptedText = Buffer.from(enc.join(':'), 'hex');
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


module.exports = {cripto, decripto};
