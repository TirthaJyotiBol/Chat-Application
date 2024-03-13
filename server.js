import Express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import chatRouter from "./chat/chat.routes.js";
import chatModel from "./chat/chat.schema.js";

const app = Express();
app.set('view engine','ejs');
app.set('views',path.join(path.resolve(),"client","views"));
app.use(Express.static(path.join(path.resolve(),'client')));

app.use('/',chatRouter);

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});

let activeUsers = {};


io.on('connection',(socket)=>{
    console.log('Socket connection successful');

    // when user joins
    socket.on('user',async (username)=>{
        if(username!=null){
            socket.curruser = username;
            activeUsers[socket.id] = username;
            socket.emit('activeUsersClient', Object.values(activeUsers));
            socket.broadcast.emit('activeUsers', Object.values(activeUsers));

            // show message to all teh users for new joinee
            socket.broadcast.emit('newJoinedUser',username);
            socket.emit('newJoinedUserClient',username);

            let oldmessages = await chatModel.find();
            socket.emit('oldmessages',oldmessages);
        }
    })

    socket.on('chat_messsage',(data)=>{
        let newChat =new chatModel({
            message:data.message,
            currenttime:data.currenttime,
            username:data.username
        });
        newChat.save();
        socket.broadcast.emit('server_messsage',data);
    });
    
    socket.on('typing',(data)=>{
        socket.broadcast.emit('typing',data);
    });
    socket.on('stop_typing',(data)=>{
        socket.broadcast.emit('stop_typing',data);
    })

    socket.on('disconnect', () => {

        socket.broadcast.emit('userLeft',socket.curruser);
        // socket.emit('userLeftClient',socket.curruser);

        delete activeUsers[socket.id];
        socket.broadcast.emit('activeUsers', Object.values(activeUsers));
    });

});



server.listen(8500,()=>{
    const url = "mongodb://127.0.0.1:27017/chatterup";
    try{
        const connect = mongoose.connect(url);
        console.log("Mongo DB Conected Successfully");
    }
    catch(err){
        console.log(err);
    }
    console.log('Server is Listening to port 8500');
});

