const constant = require('../const/friends');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        recordId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        friendId: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        engine: 'InnoDB', // default: 'InnoDB'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [
            {
                fields: ['userId'],
                unique: true,
                properties: {
                    indexName: 'user_id',
                }
            },
            {
                fields: ['friendId'],
                properties: {
                    indexName: 'friend_id',
                }
            }
        ]
    }
];