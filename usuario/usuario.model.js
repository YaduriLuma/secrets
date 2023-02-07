const { DataTypes } = require('sequelize')

module.exports = model;

function model(sequelize) {
    const atributos = {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, allowNull: false },
        senha: { type: DataTypes.STRING, allowNull: false }
    }

    const opcoes = {
        defaultScope: {
            // exclude password hash by default
            attributes: {  }
        },
        scopes: {
            // include hash with this scope
            withHash: { atributos: {}, }
        }
    }

    return sequelize.define('Usuario', atributos, opcoes)
}