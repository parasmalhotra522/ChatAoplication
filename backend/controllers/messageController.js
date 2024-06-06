import expressAsyncHandler from "express-async-handler";
import Message from "../Model/message.model.js";
import User from "../Model/User.model.js";
import Chat from "../Model/Chat.model.js";

export const sendMessage = expressAsyncHandler(async (req, res) => {

    const { chatId, content } = req.body;

    if (!chatId || !content) {
        console.log("Invalid Data passed to the request");
        return res.sendStatus(400);
    }
    
    var newMessage = {
            chat: chatId,
            content: content,
            sender: req.user._id
        };

    try {
  var message = await Message.create(newMessage);

    message = await message.populate("sender", "name profilePicture");
   console.log("After populating sneder", message);

    message = await message.populate({path:"chat",model:'Chat'});
   console.log("After populating chat", message);
   
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePicture emailId",
    });
   console.log("After populating chat users", message);
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    } catch (error) {
        res.sendStatus(400);
        throw new Error(error.message);
    }
        res.json(message);

});


export const getAllMessage = expressAsyncHandler(async(req, res) => {

    try {
        
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender", "name emailId profilePicture")
        .populate("chat");

        console.log('----',messages)
        // console.log('---- Checking messages', messages);
        res.json(messages);
    } catch (error) {
        res.sendStatus(400);
        throw new Error(error.message);
    }

});