const express = require('express');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
dotenv.config();

const { ERROR: httpError } = require('../../helpers/httpError');
const response = require('../../helpers/wrapper');
const { User } = require('../../helpers/db');

router.post('/login', login);
router.post('/register', register);
module.exports = router;

async function register(req,res) {
   try {
        let { body, query } = req;
        let model = {
            userId: uuidv4(),
            name: body.name,
            password: bcrypt.hashSync(body.password, 10),
            age: body.age,
            address: body.address,
            phone: body.bodyphone,
            role: query.role
        }

        let user = new User(model)
        let command = await user.save();

        return response.wrapper_success(res, 200, `Sukses login ${query.role}`, command);
   } catch (error) {
       console.log(error)
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, error);
   }
}

async function login(req, res) {
    try {
        let { body } = req
        let model = {
            name : body.name,
            password : body.password
        }
        const checkName = await User.findOne({ "name" : model.name });
    
        if(!checkName) {
            return res.status(204).json({"message" : "email not found"})
        }
    
        if(checkName && bcrypt.compareSync(model.password, checkName.password)) {
            const token = jwt.sign({ sub: checkName.userId }, process.env.SECRET_JWT);
    
            return res.status(200).json(
                { 
                    code : 200,
                    success: true,
                    message : `Sukses login ${checkName.role}`, 
                    data: {
                        userId: checkName.userId,
                        name: checkName.name,
                        password: checkName.password,
                        age: checkName.age,
                        address: checkName.address,
                        role: checkName.role,
                        createdAt: checkName.createdAt,
                    }, 
                    token: token
                }
            )        
        } else {
            return res.status(403).json({ code : 403, message : "Password Incorrect" })        
        }
    } catch (error) {        
        return response.wrapper_error(res, httpError.INTERNAL_ERROR, error);
    }
}