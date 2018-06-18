const constant = require('../const/messages');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        messageId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userIdFrom: {
            type: Sequelize.INTEGER
        },
        userIdTo: {
            type: Sequelize.INTEGER
        },
        message: {
            type: Sequelize.STRING(512)
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        engine: 'MYISAM', // default: 'InnoDB'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [
            {
                fields: ['userIdFrom', 'userIdTo', 'createdAt'],
                properties: {
                    indexName: 'from_to_date',
                    indicesType: 'UNIQUE'
                }
            },
            {
                fields: ['userIdTo', 'userIdFrom', 'createdAt'],
                properties:{
                    indexName: 'to_from_date',
                    indicesType: 'UNIQUE'
                }
            }
        ]
    }
];