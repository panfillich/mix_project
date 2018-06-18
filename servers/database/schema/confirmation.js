const constant = require('../const/confirmation');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        conformationId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        token: {
            type: Sequelize.STRING(64)
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        engine: 'MYISAM',  // default: 'InnoDB'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [
            {
                fields: ['token'],
                properties: {
                    indexName: 'token',
                    indicesType: 'UNIQUE'
                }
            }
        ],
    }
];