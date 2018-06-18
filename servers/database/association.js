module.exports = function (sequelize) {
    let models = sequelize.models;
    models['users'].hasMany(models['comments'], {foreignKey: 'userId', targetKey: 'userId'});
    models['comments'].belongsTo(models['users'], {foreignKey: 'userId', targetKey: 'userId'});

    models['friends'].belongsTo(models['users'], {
        foreignKey: 'friendId',
        otherKey: 'userId',
        as: 'UsersFriends'
    });

    models['cards'].belongsTo(models['collections'], {
        foreignKey: 'cardId',
        targetKey: 'cardId',
        as: 'UsersCollection'
    });
};