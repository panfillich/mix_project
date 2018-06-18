const constant = require('../const/collections');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        collectionId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type:Sequelize.INTEGER
        },

        cardId: {
            type:Sequelize.INTEGER
        },

        count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },

        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        engine: 'InnoDB', // default: 'MYISAM'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [
            {
                fields: ['userId'],
                properties: {
                    indexName: 'userId'
                }
            }
        ],
    }
];
