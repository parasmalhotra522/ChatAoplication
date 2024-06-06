import asynchandler from 'express-async-handler';
import User from '../Model/User.model.js';
import { generateToken } from '../auth/auth.js';

export const registerUser = asynchandler(async(req, res) => {

    console.log("checking request body", req.body);
    const { name, emailId, password, profilePicture } = req.body;
    try {  
        if ( !name || !emailId || !password) {
        res.status(400);
        throw new Error("Please enter all the mandatory fields");
    }
    const userExists = await User.findOne({emailId});
    
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name:name,
        emailId:emailId,
        password:password,
        profilePicture:profilePicture
    });
    // console.log("User ...check", user);

    if(user) {
        res.status(201).send({
            userId: user._id,
            name: user.name,
            emailId: user.emailId,
            profilePicture: user.profilePicture,
            //jwt token
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user")
    }

    } catch(error) {
         console.error("Error creating user:", error);
        res.status(500).send({ error: "Failed to create the user" });
    }
  

}); 

 export const authUser = asynchandler(async(req, res) => {
        const { emailId, password } = req.body;
        const user = await User.findOne({emailId});
        // if user exists and password's match then and only then 
        // return the User...
        if (user && await (user.matchPassword(password))) {

            res.json({
                _id:user._id,
                name: user.name,
                emailId: user.emailId,
                profilePicture: user.profilePicture,
                token: generateToken(user._id)
            });
        
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    });

// /api/user?search=paras
export const allUsers = asynchandler(async(req, res) => {

    const keyword = req.query.search
    ?
    {
        $or: [
            { name: { $regex:req.query.search, $options:"i" } },
            { email: { $regex:req.query.search, $options:"i" } }
        ],
    } : {};
    // this is to make sure that when user is searching for his/her friends he shouldn't be
    // able to look up for himself to chat with
    const users = await User.find(keyword).find( { _id:{ $ne : req.user._id } } )
    res.status(200).json(users);
});