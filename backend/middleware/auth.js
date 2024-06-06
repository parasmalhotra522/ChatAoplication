import asyncHandler from 'express-async-handler';
import User from '../Model/User.model.js';
import jwt from 'jsonwebtoken';


export const authGuard = asyncHandler(async(req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            
             token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.decode(token, process.env.JWTSecretKey);
            req.user = await User.findById(decodedToken.id).select('-password'); 
            next();

        } catch (error) {
            
            res.status(401);
            throw new Error('Not authorized ! Token invalid');

        }
       
    }
     if(!token) {
            res.status(401);
            throw new Error('Not authorized ! No Token');

        }

});