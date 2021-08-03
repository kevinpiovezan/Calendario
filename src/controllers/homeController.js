const Contato = require('../models/ContatoModel')

exports.index = async (req, res) => {
    const user = req.session.user
    if(user){
    const contatos = await Contato.buscaContatos(user.email);
    return res.render(`index`, { contatos });
    } else {
        const contatos = await Contato.buscaContatos(user);
        return res.render(`index`, { contatos });
    }
    // res.render(`index`, { contatos });
};
