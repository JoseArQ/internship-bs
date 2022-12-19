module.exports = function (handler) {
    return async (req, res, next) =>{
        try {
            console.log('executing handler');
            await handler(req, res);
        } catch (ex) {
            next(ex);
        }
    };
}