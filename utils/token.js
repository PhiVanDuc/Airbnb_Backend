require('dotenv').config();
const jwt = require("jsonwebtoken");

const create_verification_token = (email, exp) => {
    const token = jwt.sign(
        {
            otp: `${ Math.floor(Math.random() * 900000) + 100000 }`,
            email,
        },
        process.env.SECRET_KEY_TOKEN, 
        { 
            expiresIn: exp 
        }
    );
    return token;
}

const create_token = (payload, exp) => {
    const token = jwt.sign(
        {
            ...payload
        },
        process.env.SECRET_KEY_TOKEN, 
        { 
            expiresIn: exp 
        }
    );
    return token;
}

const decode_token = (token) => {
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
        return {
            success: true,
            decode,
        };
    } catch(error) {
        return {
            success: false,
            error
        };
    }
}

module.exports = {
    create_verification_token,
    create_token,
    decode_token,
}