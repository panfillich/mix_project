function handle(result, next) {
    if (result && typeof result.then === 'function') {
        return result.then(undefined, function (err) {
            return next(err || new Error('Promise was rejected with a falsy value'));
        });
    }
    return result;
}

function wrapper(fn) {
    if (fn.length === 4) {
        return function (err, req, res, next) {
            return handle(fn(err, req, res, next), next);
        };
    }
    return function (req, res, next) {
        return handle(fn(req, res, next), next);
    };
}

module.exports.wrapper = wrapper;