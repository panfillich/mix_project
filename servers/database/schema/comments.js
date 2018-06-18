const constant = require('../const/comments');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        commentId: {
            type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
        },
        status: {
            type: Sequelize.INTEGER(2),
            defaultValue: constant.status.VISIBLE
            // 0 - не опубликован
            // 1 - опубликован
        },
        articleId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        },
        comment: {
            type:Sequelize.TEXT('tiny')
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
        engine: 'MYISAM',  // default: 'InnoDB'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        indexes: [
            /*{
             fields: ['status', 'articleId', 'createdAt'],
             properties: {
             indexName: 'status_article_date'
             }
             }*/
        ],
    }
];