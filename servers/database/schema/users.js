const constant = require('../const/users');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {

        userId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: Sequelize.STRING(128),
        email: Sequelize.STRING(128),
        password: Sequelize.STRING(256),
        webToken: Sequelize.STRING(512),
        webTokenCreate: Sequelize.DATE,
        gameToken: Sequelize.STRING(512),
        gameTokenCreate: Sequelize.DATE,
        status: {
            type: Sequelize.INTEGER(2),
            defaultValue: constant.status.INVITED
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal( 'CURRENT_TIMESTAMP' )
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        engine: 'InnoDB',// default: 'InnoDB'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes:[]
    }
];