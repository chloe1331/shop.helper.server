const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = {
    generateToken: (data) => {
        // let created = Math.floor(Date.now() / 1000);
        let cert = fs.readFileSync(path.join(__dirname, '../../config/rsa_private_key.pem'));
        let token = jwt.sign({
            data,
            // exp: created + 3600 * 24
        }, cert, {
            algorithm: 'RS256'
        });
        return token;
    },

    verifyToken: (token) => {
        let cert = fs.readFileSync(path.join(__dirname, '../../config/rsa_public_key.pem'));
        return new Promise((resolve, reject) => {
            jwt.verify(token, cert, {
                algorithms: ['RS256']
            }, function (err, decoded) {
                if (err) {
                    reject(new Error(err.message == 'jwt expired' ? '登录失效' : err.message));
                } else {
                    resolve(decoded);
                }
            });
        });
    },

    randomPassword: (size) => {
        const seed = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '2', '3', '4', '5', '6', '7', '8', '9'
        ); //数组
        const seedlength = seed.length; //数组长度
        let createPassword = '';
        for (let i = 0; i < size; i++) {
            let j = Math.floor(Math.random() * seedlength);
            createPassword += seed[j];
        }
        return createPassword;
    }
};