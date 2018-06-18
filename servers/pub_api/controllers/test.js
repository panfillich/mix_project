let express     = require('express');
let router      = express.Router();
const wrapper = require('../../common_libs/async_middleware').wrapper;


if(process.env.NODE_ENV === 'dev') {

    router.get('/', wrapper(async function (req, res, next) {

        // console.log(req.body);
        // console.log(req.baseUrl)

        return res.status(200).json({message: "API works well"});
    }));

    router.get('/error', wrapper(async function (req, res, next) {
        throw new Error('Test Error.')
    }));
}

module.exports = router;
