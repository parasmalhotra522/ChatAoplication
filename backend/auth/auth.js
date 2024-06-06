import jwt from 'jsonwebtoken';

export const generateToken = (id) => {

    return jwt.sign({id}, process.env.JWTSecretKey, 
        {
        expiresIn:60*60
        }
    );
} 

