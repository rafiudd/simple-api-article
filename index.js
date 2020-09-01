require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const dotenv = require('dotenv');
const errorHandler = require('helpers/error-handler');
const jwt = require('helpers/jwt');
const userController = require('./modules/users/users.controller')
const articleController = require('./modules/article/article.controller');

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

app.get('/', function (req, res) {
    res.json({
        success: true,
        status: 200,
        message: 'Service is successfull running :D'
    });
});

app.post('/api/v1/users/login', useBasicAuth, userController.login);
app.post('/api/v1/users/login', useBasicAuth, userController.register);
app.put('/api/v1/users/update/:userId', userController.updateUser);

app.post('/api/v1/article/create', articleController.createArticle);
app.get('/api/v1/article/all', articleController.getAllArticle);
app.get('/api/v1/article/', articleController.getDetailArticle);
app.delete('/api/v1/article/delete/:articleId', articleController.deleteArticle);
app.put('/api/v1/article/update/:articleId', articleController.updateArticle);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8080;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});