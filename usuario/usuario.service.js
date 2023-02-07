const bcrypt = require('bcryptjs')

const db = require('../_helpers/db')

module.exports = {
    getAll,
    getById,
    verifyUser,
    create,
    update,
    delete: _delete
}

async function getAll() {
    return await db.Usuario.findAll()
}

async function getById(id) {
    return await getUsuario(id)
}

async function verifyUser(email, senha){
    const usuario = await db.Usuario.findOne({where: {email: email}})
    if (!usuario) throw 'Usuario não encontrado'
    const verificaSenha = await bcrypt.compare(senha, usuario.senha)
    if (usuario.length == 0) throw 'Email inexistente'
    if (! verificaSenha) throw 'Senha incorreta'
    return usuario
}

async function create(email, senha) {
    // Verificar se não tem outro email cadastrado
    if (await db.Usuario.findOne({ where: { email: email } })) {
        throw 'Email "' + email + '" já está cadastrado';
    }

    const usuario = new db.Usuario({email: email, senha: senha});

    usuario.senha = await bcrypt.hash(senha, 10);

    // Salva o Usuário
    await usuario.save();
}

async function update(id, email, senha) {
    const usuario = await getUsuario(id);

    // validate
    const tituloChanged = email && usuario.titulo !== email;
    if (tituloChanged && await db.Usuario.findOne({ where: { email: email } })) {
        throw 'Email "' + email + '" já está cadastrado';
    }

    // copy params to user and save
    Object.assign(usuario, email, senha);
    await usuario.save();
}

async function _delete(id) {
    const usuario = await getUsuario(id);
    await usuario.destroy();
}

// helper functions

async function getUsuario(id) {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) throw 'Usuario não encontrado';
    return usuario;
}