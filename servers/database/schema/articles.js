const constant = require('../const/articles');
const Sequelize = require('sequelize');

module.exports = [
    constant.table_name,
    {
        articleId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: Sequelize.STRING(50),
        keywords: Sequelize.STRING(200), //10 слов
        description: Sequelize.STRING(140),
        language: { //< meta http-equiv="content-language" content="ru">
            type:Sequelize.STRING(2),
            defaultValue: constant.language.EN
        },
        robots: {
            type:Sequelize.STRING(8),
            defaultValue: constant.robots.INDEX
        },
        articleText: {
            type:Sequelize.TEXT('medium')
        },
        commentStatus: {
            type: Sequelize.INTEGER(2),
            defaultValue: constant.commentStatus.ON
        },
        type: {
            type: Sequelize.INTEGER(2),
            defaultValue: constant.type.NEWS
        },
        publishStatus: {
            type: Sequelize.INTEGER(2),
            defaultValue: constant.publishStatus.PUBLISH
        },
        publishAt: {
            type: Sequelize.DATE
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
                fields: ['publishStatus', 'type', 'publishAt'],
                properties: {
                    indexName: 'status_article_date'
                }
            },
            {
                fields: ['publishStatus', 'type', 'articleId'],
                properties: {
                    indexName: 'status_article',
                    indicesType: 'UNIQUE'
                }
            }
        ]
    }
];