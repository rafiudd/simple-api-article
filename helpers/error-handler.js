
module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Basic Auth' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}