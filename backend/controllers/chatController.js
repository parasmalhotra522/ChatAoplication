import expressAsyncHandler from "express-async-handler";
import Chat from "../Model/Chat.model.js";
import User from "../Model/User.model.js";


// -- function is to create 1 on 1 chat
export const accessChats = expressAsyncHandler(async(req, res) => {

    // -- we need 2 users one is logged in already and 1 more to start a chat
    console.log("Check the req.body", req.body);
    const { userId } = req.body; // id of the user to start chat with
   
    const loggedInUser = req.user._id;
    // -- now we need to check if the chat lready existed between 2 users

    var isChat = Chat.find({
        isGroupChat:false,
         $and : [
            {users : { $elemMatch : { $eq: loggedInUser } }},
            { users: { $elemMatch : { $eq: userId } }}
        ]
    }) // if the chat existed pull down userdata except password & latest Message
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, 
    {
        path: 'latestMessage.sender',
        select: "name pic email",
    })

    // if chat exists since it is between 2 users so we will have chat at 0 index
   if(isChat.length > 0) {
    res.send(isChat[0]);
   } else {
    // if chat doesn't exists we need to create a new chat
    try {
        const newChat = await Chat.create({
        users : [loggedInUser, userId],
        chatName : "sender",
        isGroupChat : false,
    });

    // once the chat is created between 2 users we need to retreive the
    //  chat and send them back as response
    const fullChat = await Chat.findOne({_id:newChat._id,})
    .populate("users", "-password")
    .populate("latestMessage");

    res.status(200).send(fullChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message); 
    }  
    
   }

});


// -- function to fetch chats for user
export const fetchAllChats = expressAsyncHandler(async(req, res) => {
    try {
        if(!req.user) {
            res.status(401).send("Unauthorized Access")
        } 
        const loggedInUser = req.user._id;
        // -- now query all the chats for this user
        let chats = await Chat.find({users:{ $elemMatch : {$eq: loggedInUser} }})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        
        chats =  await User.populate(chats, {
                path : "latestMessage.sender",
                select : "name profilePicture emailId"
            });
        res.status(200).send(chats);
        
        console.log("Checking the chats ,,", chats);        
        
    } catch (error) {
        res.status(400);   
        console.log("Checking error in backend", error); 
        throw new Error(error.error.message);    
    }  
}); 

// -- function to create a Group Chat

export const createGroupChat = expressAsyncHandler( async(req, res) => {
   
    if(!req.body.users || !req.body.chatName) {
        return res.status(400).send({message:"Please fill out all the fields"})
    }
    const chatName = req.body.chatName; 
    const users = JSON.parse(req.body.users);
    if(users.length < 2) {
        return res.status(400).send({message:"Please Select more than 2 users to make a group"})
    }
    users.push(req.user._id);
    try { 
       const groupChat = await Chat.create({
            chatName: chatName,
            users:users,
            isGroupChat: true,
            groupAdmin: req.user 
        });

        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users", "-password")
         .populate("groupAdmin", "-password")
        .populate("latestMessage");

        res.status(200).send(fullGroupChat);

    } catch(error) {
        res.status(400);
        throw new Error(error.error.message);
    }
});

export const renameGroup = expressAsyncHandler(async(req, res) => {

    const {chatId, chatName} = req.body;
 
    try {
       const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName: chatName, },
            { new:true, } 
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if( !updatedChat ) {
            res.status(404);
            throw new Error("Chat not found");
        } else {
            res.json(updatedChat);
        }

    } catch (error) {
        res.status(400);
        throw new Error(error.error.message);
    }

}); 


// -- add new user to the Group

export const addToGroup =  expressAsyncHandler(async(req, res) => {

    const { chatId, userId } = req.body;
    
    if (!chatId || !userId) {
        return res.status(400).json("Please provide chatId, userId for adding new member to the Group");
    }
    const addedNewMember = await Chat.findByIdAndUpdate(chatId,
        { $push: { users: userId } },
        { new: true}
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!addedNewMember) {
        res.status(404);
        throw new Error("Chat not Found");
    } else {
        res.status(200).json(addedNewMember);
    }

});

// -- remove a user from the Group

export const removeUserFromGroup =  expressAsyncHandler(async(req, res) => {

    const { chatId, userId } = req.body;
    
    if (!chatId || !userId) {
        return res.status(400).json("Please provide chatId, userId for adding new member to the Group");
    }
    const removedMember = await Chat.findByIdAndUpdate(chatId,
        { $pull: { users: userId } },
        { new: true}
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removedMember) {
        res.status(404);
        throw new Error("Chat not Found");
    } else {
        res.status(200).json(removedMember);
    }

});

