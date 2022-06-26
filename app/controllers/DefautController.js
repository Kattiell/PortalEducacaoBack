const { auth, userscolec, admincolec } = require("./../firebase")

module.exports = {
    async Administrador(req, res) {
        await admincolec.get()
            .then(async (snapshot) => {
                if (snapshot.empty) {
                    await auth.createUser({
                        uid: '1',
                        email: 'projeteduca5pi@gmail.com',
                        password: 'oloko.com1',
                        emailVerified: true,
                    })
                        .then(async (auth) => {
                            const user = await userscolec.add({
                                email: 'projeteduca5pi@gmail.com',
                                authid: auth.uid,
                                address: 'rua berilo 465 alto dos caiçaras',
                                name: 'Admin',
                                role:'admin',
                            });
                            await admincolec.add({
                                userid: user.id,
                                phone: '34 9 9999 9999',
                                scholl: 'Unipam'
                            });
                            return res.send({
                                msg: 'admin criado com sucesso',
                            });
                        }).catch((err)=>{
                            return res.send({
                                msg:err
                            });
                        });

                } else {
                    return res.send({
                        msg: 'função desativada',
                    });
                }
            }).catch((err) => {
                return res.send({
                    msg: err
                });
            });

    }

}