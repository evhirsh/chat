const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const http = require('http');
const logger = require('morgan');
const passport = require('passport');
var config = require('./config/db');
const bodyParser = require('body-parser');
const api = require('./routs/api')
const app = express();
app.use(passport.initialize());

mongoose.connect(config.database,{useNewUrlParser:true})//return a promiss
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));




app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'chat-app\\dist\\chat-app')));
app.use('/api', api);


/**
 * Get port from environment and store in Express.
 */

var port  = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.all('*',(req,res) =>{
  res.sendfile(path.join(__dirname, 'chat-app\\dist\\chat-app\\index.html'))
})

const server = http.createServer(app);
server.listen(port,() => console.log('listening on port 3000...'));
const io = require('socket.io').listen(server);

io.on('connection',(socket)=>{

    console.log('new connection made.');


    socket.on('join', function(data){
     
      socket.username = data.user;
      // store the room name in the socket session for this client
      socket.room = data.room;
      // send client to room 1
      socket.join(data.room);
      // echo to room 1 that a person has connected to their room
      console.log(data.user + 'joined the room : ' + data.room);

      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});

      
    });


    socket.on('leave', function(data){
    
      console.log(data.user + 'left the room : ' + data.room);

      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});
      socket.room='';

      socket.leave(data.room);
    });

    socket.on('message',function(data){
      if (data.room === socket.room) io.in(data.room).emit('new message', {user:data.user, message:data.message});
    })

    socket.on('switchRoom', function(newroom){
      // leave the current room (stored in session)
    console.log("in switch")
    console.log("newroom",newroom)
    console.log("old",socket.room)
      socket.leave(socket.room);
      // join new room, received as function parameter
      socket.join(newroom);
      socket.broadcast.to(socket.room).emit('left room', {user:socket.username, message:'has left this room.'});
      // update socket session room title
      socket.room = newroom;
      socket.broadcast.to(newroom).emit('new user joined',  {user:socket.username, message:'has join this room.'});
  
    });

    socket.on('isTyping',function(user){
      socket.broadcast.to(socket.room).emit('typing', {message:`${user} is typing...`});
    })
  
});

/**
 * Listen on provided port, on all network interfaces.
 */


function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }