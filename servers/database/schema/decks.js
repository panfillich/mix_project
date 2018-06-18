const constant = require('../const/decks');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        deckId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type:Sequelize.INTEGER
        },

        // Номер колоды
        number: {
            type: Sequelize.INTEGER
        },

        // Карта
        cardId: {
            type: Sequelize.INTEGER
        },

        // Колличество конкретной карты в колоде
        count: {
            type: Sequelize.INTEGER
        },

        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        engine: 'InnoDB', // default: 'MYISAM'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [
            {
                fields: ['userId', 'number'],
                properties: {
                    indexName: 'userId_number'
                }
            }
        ],
        const: constant
    }
];