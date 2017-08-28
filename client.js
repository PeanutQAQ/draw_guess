var $ = require('jquery');
var io = require('socket.io-client');
var socket = io();
//聊天数据
var NAME = 'visiter';
var data = {name : 'someone', msg : 'text'};
//绘画数据
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var new_dot = {x : 0, y : 0};
var last_dot = {x : 0, y : 0};
var canvas_pos = {x : 0, y : 0};
var flag = false;
//canvas初始化
ctx.strokeStyle='black';
ctx.lineWidth="5";
canvas_pos.x = window.innerWidth-500;
canvas_pos.y = 20;
//聊天模块
var chat = {
  sub : function(){
    data.msg = $("#m").val();
    data.name = NAME;
    socket.emit('chat message', data);
    $('#m').val('');
    return false;
  },

  emit : function(data){
    var $li = $('<li></li>'),
        $name = $('<span></span>'),
        $msg = $('<span></span>');
    $name.text(data.name);
    $msg.text(data.msg);
    $li.append($name).append($msg);
    $('#messages').append($li);
    var div = document.getElementById('messages');
    div.scrollTop = div.scrollHeight;
  }
};
//绘画模块
function draw(){
  if ( flag ){
     ctx.beginPath();
     ctx.moveTo(last_dot.x,last_dot.y);
     ctx.lineTo(new_dot.x,new_dot.y);
     ctx.closePath();
     ctx.stroke();
     socket.emit('draw message',last_dot,new_dot);
  }
  last_dot.x = new_dot.x;
  last_dot.y = new_dot.y;
 };
$('.nicksend').click(function(){
    var $nickname = $('.nickname');
    NAME = $nickname.val()? $nickname.val(): null;
    console.log(NAME);
    $('#name').css('display', 'none');
    $('#main').css({'display':'block','background-color':'white'});
    $('.draw').css('display', 'block');
});
$('form').submit(chat.sub);
socket.on('chat message',function(msg){
  data.name = msg.name;
  data.msg = msg.msg;
  chat.emit(data);
});
socket.on('draw message',function(msg1,msg2){
  last_dot = msg1;
  new_dot = msg2;
  draw();
});
$('canvas').mousedown(function(e) {
  flag = true;
  last_dot.x = e.pageX - canvas_pos.x;
  last_dot.y = e.pageY - canvas_pos.y;
});
$('canvas').mousemove(function(e){
  new_dot.x = e.pageX - canvas_pos.x;
  new_dot.y = e.pageY - canvas_pos.y;
  draw();
});
$('canvas').mouseup(function(){
  flag = false;
});
