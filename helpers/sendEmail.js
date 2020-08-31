const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

function sendEmail(payload) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    });

    const readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    readHTMLFile(path.join(__dirname, '..', 'data', 'template.html'), function(err, html) {
        let template = handlebars.compile(html);
        let api = `${process.env.DOMAIN_CHOOSE}/api/select?`;
        let data = {
            konselorId1: payload.konselor[0].konselorId,
            konselorName1: payload.konselor[0].konselorName,
            chooseKonselor1: `${api}userId=${payload.userId}&konselorId=${payload.konselor[0].konselorId}&redirect=true`,
            avatar1: payload.konselor[0].avatar,
            profesi1: payload.konselor[0].profesi,
            konselorId2: payload.konselor[1].konselorId,
            konselorName2: payload.konselor[1].konselorName,
            chooseKonselor2: `${api}userId=${payload.userId}&konselorId=${payload.konselor[1].konselorId}&redirect=true`,
            avatar2: payload.konselor[1].avatar,
            profesi2: payload.konselor[1].profesi,
            konselorId3: payload.konselor[2].konselorId,
            konselorName3: payload.konselor[2].konselorName,
            chooseKonselor3: `${api}userId=${payload.userId}&konselorId=${payload.konselor[2].konselorId}&redirect=true`,
            avatar3: payload.konselor[2].avatar,
            profesi3: payload.konselor[2].profesi,
        }
        let htmlToSend = template(data);
        let mailOptions = {
            from: process.env.USER_EMAIL,
            to: payload.user.email,
            subject: 'Result Match Expert',
            html: htmlToSend
        };
    
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log('Email sent: ' + info.response);
        });
    });
    
}

module.exports = sendEmail;