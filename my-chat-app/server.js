const express = require('express');
const path = require('path');
const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const api = require('./routs/api')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//   next();
// });
app.use('/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('index');
});


/**
 * Get port from environment and store in Express.
 */

var port  = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

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