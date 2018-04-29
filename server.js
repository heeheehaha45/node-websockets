var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/static", express.static(__dirname + '/static'));

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

cur_room="";
users = [];
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUsername', function(_data) {
      
       var data=_data.username;
       
       console.log(data);
       
      

//      socket.join(room_id);
       
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   
   socket.on('msg', function(data) {
      //Send message to everyone
    //  io.sockets.emit('newmsg', data);
       
      var room_id=data.room_id;
           
      socket.join(room_id);
      io.to(room_id).emit('newmsg', data);

      
         
      
       
   })
});

http.listen(process.env.PORT || 3000, function() {
   console.log('listening on localhost:3000');
});