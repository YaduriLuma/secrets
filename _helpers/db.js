require('dotenv').config()
const tedious = require('tedious');
const { Sequelize } = require('sequelize');
const dbName = process.env.dbName
const dbConfig = {
    server: process.env.server,
    options: {
        port: Number(process.env.port),
        encrypt: process.env.encrypt === 'true' ? true : false,
        trustServerCertificate: process.env.trustServerCertificate === 'true' ? true : false
    },
    "authentication": {
        "type": "default",
        "options": {
            "userName": process.env.userNameBd,
            "password": process.env.password
        }
    }
}
module.exports = db = {};

const os = require('os');
os.hostname = () => 'BRUNO-PC';

inicializa()

async function inicializa() {
    const host = dbConfig.server
    const userName = process.env.userNameBd
    const password = process.env.password

    

    //Conecta no DB
    if (process.env.dialect == 'mssql') {
        // Cria o banco se ainda não existe
        await verificaDbExiste(dbName)

        let sequelize = new Sequelize(dbName, userName, password, {
            host, dialect: process.env.dialect,
            dialectOptions: {
                options: {
                    "encrypt": dbConfig.options.encrypt
                }
            }
        })

        // inicia o modelo e adiona ele aos objetos exportados do DB
        // adicionar todos os modelos aqui
        db.Usuario = require('../usuario/usuario.model')(sequelize);
        
        // sincroniza os modelos com o banco
        await sequelize.sync({ alter: true })

    } else if (process.env.dialect == 'postgres') {
        const sequelize = new Sequelize(dbName, userName, password,
            {
                host: host,
                dialect: process.env.dialect,
                dialectOptions: {
                    ssl: {
                        require: dbConfig.options.encrypt
                    }
                }
            });
        db.Usuario = require('../usuario/usuario.model')(sequelize);
        await sequelize.sync({ alter: true });
    }

}

async function verificaDbExiste(dbName) {
    return new Promise((resolve, reject) => {
        const connection = new tedious.Connection(dbConfig)
        connection.connect((err) => {
            if (err) {
                console.error(err);
                reject(`Conexão Falhou: ${err.message}`);
            }

            const createDbQuery = `IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbName}') CREATE DATABASE [${dbName}];`;
            const request = new tedious.Request(createDbQuery, (err) => {
                if (err) {
                    console.error(err);
                    reject(`Query para criar o DB falhou: ${err.message}`);
                }

                // query executed successfully
                resolve();
            });

            connection.execSql(request);
        });
    });
}