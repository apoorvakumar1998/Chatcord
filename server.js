const express = require('express');
const path = require('path');
const app = express(); 
const PORT = process.env.PORT || 3000;
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages');
const botName = 'CHATBOT';
const { userJoin , getUserById , userLeave , roomUsers } = require('./utils/users');

//set static folder
app.use(express.static(path.join(__dirname,'public')));

io.on('connection',socket =>{
  socket.on('joinRoom', ({username,room}) => {
    const user = userJoin(socket.id,username,room);
    socket.join(user.room);
    //welcome current user
    socket.emit('message',formatMessage(botName,'welcome to chatcord'));
    //broadcast when new user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));
    //send user data
     io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: roomUsers(user.room)
    })
  })
  socket.on('chatMessage',(message) => {
    const user = getUserById(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,message));
  })
  socket.on('disconnect',() => {
    //get user details
    const user = userLeave(socket.id);
    if(user){
      //remove user from room
      io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: roomUsers(user.room)
    })
    //broadcast user data to room
      io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
    }
  })
})

server.listen(PORT,()=>{
  console.log(`app started on port ${PORT}`);
});