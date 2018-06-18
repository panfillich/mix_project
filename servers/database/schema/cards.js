const constant = require('../const/cards');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        cardId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        // Тип карты
        type: {
            type:Sequelize.INTEGER,
            defaultValue: constant.type.COMMON
        },

        // Редкость карты
        rarity: {
            type:Sequelize.INTEGER,
            defaultValue: constant.rarity.COMMON,
        },

        // Обычная стоимость карты
        normalCost: {
            type:Sequelize.INTEGER,
            defaultValue: 1
        },

        // Спец. стоимость
        specialCost: {
            type:Sequelize.INTEGER,
            defaultValue: 0
        },

        // Жизни
        health: {
            type:Sequelize.INTEGER,
            defaultValue: 1
        },

        //Атака
        attack: {
            type:Sequelize.INTEGER,
            defaultValue: 1
        },

        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
    },
    {
        engine: 'MYISAM', // default: 'InnoDB'
        charset: 'utf8',
        collate: 'utf8_general_ci',

        indexes: [
            {
                fields: ['type'],
                properties: {
                    indexName: 'type'
                }
            }
        ]
    }
];