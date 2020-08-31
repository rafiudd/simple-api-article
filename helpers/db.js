const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../modules/users/users.model')
};