let Users = require('./users');

let Models = {
    Users: new Users()
};

let Actions = {};

Actions.setDatabase = function (database) {
    Object.values(Models).forEach(function (model) {
        model.setDatabase(database);
    });
};

module.exports = Object.assign({}, Models, Actions);