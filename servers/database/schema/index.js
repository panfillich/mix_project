const current_folder = __dirname;
const current_file   = __filename;
const fs = require('fs');

let schemas = [];

fs.readdirSync(current_folder).forEach(file => {
    if((current_folder+'/'+file) == current_file){
        return;
    }
    let schema = require('./' + file);
    schemas.push(schema);
});

module.exports = schemas;

