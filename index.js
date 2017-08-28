var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('./mysql');
var clients = [];
var host,result;

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){//socket是服务器和客户端建立的每一条链接
  //进入页面的前两个用户间随机房主

  if(clients.length<2){
    clients.push(socket.id);
  }
  io.sockets.emit('keyijingxuan',clients.length);
  if(clients.length==2){
    host = clients[Math.round(1*Math.random())];
    var promise = mysql.get;
    promise.then(function(temp){
      result = temp;
      io.sockets.emit('fangzhu', host,result);//全局发送fangzhu事件
    }).catch(function(temp){
      console.log(temp);
    });
  }
  socket.on('disconnect', function(){
    console.log('user disconnected');
    for(var i = 0;i<clients.length; i++){
      if(socket.id == clients[i]){
        clients.splice(i,1);
      }
    };
    //console.log(clients.length);
    io.sockets.emit('duankailianjie',clients.length);
  });
  socket.on('chat message', function(data){
    if(data.msg==result){
      data.right = true;
    }
    io.sockets.emit('chat message',data);
    mysql.add(data);
  });
  socket.on('draw message',function(arg1,arg2,arg3,arg4){
    if(socket.id==host){
      arg4 = true;
    } else {
      arg4 = false;
    }
    io.sockets.emit('draw message',arg1,arg2,arg3,arg4);
  });

});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
