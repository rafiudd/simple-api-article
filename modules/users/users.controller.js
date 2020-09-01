const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
dotenv.config();

const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const { User } = require('../../helpers/db');


async function register(req,res) {
   try {
        let { body } = req;
        let model = {
            userId: uuidv4(),
            fullname: body.fullname,
            username: body.username,
            password: bcrypt.hashSync(body.password, 10),
            age: body.age,
            address: body.address,
            phone: body.phone,
            email: body.email
        }

        const checkEmail = await User.findOne({ "email" : model.email });
    
        if(checkEmail) {
            return response.wrapper_error(res, httpError.CONFLICT, "email already taken");
        }

        let user = new User(model)
        let command = await user.save();

        return response.wrapper_success(res, 200, 'Success register user', command);
   } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");
   }
}

async function login(req, res) {
    try {
        let { body } = req
        let model = {
            email : body.email,
            password : body.password
        }
        const checkEmail = await User.findOne({ "email" : model.email });
    
        if(!checkEmail) {
            return response.wrapper_error(res, httpError.SERVICE_UNAVAILABLE, "sorry, your email is not registered");
        }
    
        if(checkEmail && bcrypt.compareSync(model.password, checkEmail.password)) {
            const token = jwt.sign(
                { sub: checkEmail.userId }, 
                process.env.SECRET_JWT,
                { 
                    algorithm: "HS256",
                    expiresIn: 900
                }
            );
            let returnModel = {
                userId: checkEmail.userId,
                fullname: checkEmail.fullname,
                username: checkEmail.username,
                password: checkEmail.password,
                age: checkEmail.age,
                address: checkEmail.address,
                email: checkEmail.email,
                phone: checkEmail.phone,
                createdAt: checkEmail.createdAt,
                updateAt: checkEmail.createdAt,
                token: token
            }
            return response.wrapper_success(res, 200, 'Success login user', returnModel);                
        } else {
            return response.wrapper_error(res, httpError.UNPROCESSABLE_ENTITY, "sorry, wrong password");
        }
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");
    }
}

async function updateUser(req, res) {
    try {
        let { body, params } = req;
        let { userId } = params;
        let queryData = await User.findOne({ "userId": userId });
       
        if(!queryData) {
            return response.wrapper_error(res, httpError.SERVICE_UNAVAILABLE, "sorry, article not available");
        }

        let model = {
            fullname: body.fullname ? body.fullname: queryData.fullname,
            username: body.username ? body.username: queryData.username,
            password: bcrypt.hashSync(body.password, 10) ? bcrypt.hashSync(body.password): queryData.password,
            age: body.age ? body.age: queryData.age,
            address: body.address ? body.address: queryData.address,
            email: body.email ? body.email: queryData.email,
            phone: body.phone ? body.phone: queryData.phone,
            updateAt: new Date().toISOString()
        }

        let command = await User.updateOne({ "userId": userId }, model);

        return response.wrapper_success(res, 200, 'Success update user', command);                
    } catch (error) {
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, "something when wrong");        
    }
}

module.exports = {
    updateUser,
    login,
    register
}