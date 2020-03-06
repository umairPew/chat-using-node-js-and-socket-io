var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var messages =["chat started"];


var online =["Online:"];
var num=0;

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket){
    io.emit('clearonline');
    socket.emit('initializecookie');
    socket.emit('douser');
  console.log('a user connected');
  for(var msg in messages){
    socket.emit('chat message', messages[msg])
    //console.log(messages[msg] + " test")
  }
  socket.on('disconnect', function(){
      online =["Online:"];
      io.emit('clearonline');
      io.emit('addonline', "Online:");
      io.emit('online');
    console.log('user disconnected');
  });
    function leading0(x) {
        if (x < 10) {x ="0"+x;}
        return x;
    }
  socket.on('chat message', function(msg){
      console.log(msg);
      time = new Date();
      current = leading0(time.getHours()) + ":" + leading0(time.getMinutes()) +" ";
      
      messages.push(current+msg);
      io.emit('chat message', current+msg);
    //this.broadcast.emit('chat message', msg);
  });
  socket.on('returncookie',function(cook){
      if(cook==""){
          console.log("no cookie");
          num= Math.floor(Math.random() * (99 - 1) + 1);
          while(online.includes("user"+num)){
              num= Math.floor(Math.random() * (99 - 1) + 1);
          }
          socket.emit('makecookie',"user"+num +" "+getRandomColor());
          online.push("user"+num);
          io.emit('clearonline');
          for (var x in online) {
            io.emit('addonline', online[x]);
            }
          
          console.log("users online: "+online);
      }
      else{
         online.push(cook);
         io.emit('clearonline');
         for (var x in online) {
            io.emit('addonline', online[x]);
            }
         
         console.log("users online: "+online);
      }
  });
  socket.on('returnonline',function(cook){
      online.push(cook);
      io.emit('addonline', cook);
      console.log("users online: "+online);
  });
  socket.on('checkname',function(name){
      if(online.includes(name)||name.includes(" ")){
          socket.emit('namebad');
      }else{
          socket.emit('namegood',name);
          online =["Online:"];
          io.emit('clearonline');
          
          io.emit('addonline', "Online:");
            
          io.emit('online');
          console.log('user disconnected');
      }
  });
});

function getRandomColor() {
  var all = '0123456789ABCDEF';
  var notwhite='0123456789ABCD';
  var color = '#';
  color+=notwhite[Math.floor(Math.random() * 14)];
  for (var i = 0; i < 5; i++) {
    color += all[Math.floor(Math.random() * 16)];
  }
  return color;
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});