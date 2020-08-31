require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const dotenv = require('dotenv');
const errorHandler = require('helpers/error-handler');
const jwt = require('helpers/jwt');

dotenv.config();
app.use(jwt());
app.use(errorHandler);

const useBasicAuth = basicAuth({
    users: { 
        [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD 
    },
    unauthorizedResponse: (req) => {
        return 'Unauthorized'
    }
});

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', useBasicAuth, function (req, res) {
    res.json({
        status: 200,
        message: 'Service is successfull running :D'
    });
});

app.use('/api/v1/users',useBasicAuth, require('./modules/users/users.controller'));
app.use('/api/v1/article', require('./modules/article/article.controller'));

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8080;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});