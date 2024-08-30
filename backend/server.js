import express from "express";
import dotenv from "dotenv";
// import {chats} from "./data/data.js";
import connectDb  from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from 'cors';
import chatRouter from './routes/chat.routes.js';
import messageRouter from './routes/message.routes.js';
import {Server} from "socket.io";
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;
app.use(express.json());
app.use(cors());
connectDb();

// app.get('/', (req, res)=>{
//     res.send('Api is running');
// });


app.use('/api/user', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/message', messageRouter);

// ----- DEPLOYMENT -----
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    });

} else {
    app.get('/', (req, res) => {
        res.send("Api is running successfully");
    });
}





// -----------------------

// --- MIDDLEWARES FOR HANDLING ERRORS
app.use(notFound);
app.use(errorHandler);

const server =app.listen(port, console.log(`Server is running at port ${port}`));


const io = new Server(server, {  pingTimeOut: 60000,
    cors : {
        origin:['http://localhost:3000', "https://lets2alk.onrender.com"],
    },
});

io.on("connection", (socket) => {
    console.log('I am connected to socket');

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log('-- connectin with', userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined the room", room);
    });

    socket.on("new message", (newMessageReceived) => {

        var chat = newMessageReceived.chat;
        if (!chat.users) {
            return console.log("chat.users not defined");
        }
        
        chat.users.forEach((user) => {

            // this means that i am the one who is sending the message
            // so in this case we need not send the message back to myself
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);

        })

    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))
    
    socket.off("setup", ()=>{
        console.log("User Disconnected");
        socket.leave(userData._id);
    })  


});


