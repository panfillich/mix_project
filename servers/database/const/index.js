const current_folder = __dirname;
const current_file   = __filename;
const fs = require('fs');

let constants = {};

fs.readdirSync(current_folder).forEach(file => {
    if((current_folder+'/'+file) == current_file){
        return;
    }
    let constant = require('./' + file);
    constants[constant.table_name] = constant;
});

module.exports = constants;

