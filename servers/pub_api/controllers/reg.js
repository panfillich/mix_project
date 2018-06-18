let express     = require('express');
let router      = express.Router();

const Joi       = require('joi');
const CONFIG    = require('../../config.js');
const wrapper   = require('../../common_libs/async_middleware').wrapper;

let models = require('../../models');
let Users = models.Users;

// let ServerError = require('../../common_libs/error').ServerError;
const schema = Joi.object().keys({
    login:      Joi.string().alphanum().min(3).max(30).required(),
    password:   Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,30}$/).required(),
    email:      Joi.string().email().max(30).required()
}).min(3).max(3);


// Create user
router.post('/', wrapper(async function (req, res) {
    const result = Joi.validate(req.body, schema);
    let res_data = {
        validation: {
            is_valid_data_format: true,
            is_unique_email: null,
            is_unique_login: null
        }
    };
    let res_dev_data = { validation: {} };

    if(result.error){
        res_data.validation.is_valid_data_format = false;
        res_dev_data.validation.details = result.error.details;
        return res.status(400).setError(result.error).setDevInfo(res_dev_data).json(res_data);
    }

    const value = result.value;
    const check = await Users.checkUniqueUser(value);

    res_data.validation.is_unique_email = check.is_unique_email;
    res_data.validation.is_unique_login = check.is_unique_login;

    if(!check.is_unique){
        return res.status(400).json(res_data);
    }

    await Users.createNewUser(value);

    res.status(201).json();
}));


// Change user status
router.get('/confirm/:token([a-z0-9]{'+CONFIG.security.token.length+'})', wrapper(async function (req, res, next){
        throw new Error('Test Error.');
}));

module.exports = router;

