var mysql  = require('mysql');
var i = 0;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port : '3306',
  database: 'hugo',
});

connection.connect();
var add = function(data) {
  var  addSql = 'INSERT INTO chat(name,msg) VALUES(?,?)';
  var  addSqlParams = [];
  addSqlParams[0] = data.name;
  addSqlParams[1] = data.msg;
  connection.query(addSql,addSqlParams,function (err, result) {
          if(err){
           console.log('[INSERT ERROR] - ',err.message);
           return;
          }

         console.log('--------------------------INSERT----------------------------');
         //console.log('INSERT ID:',result.insertId);
         console.log('INSERT ID:',result);
         console.log('-----------------------------------------------------------------\n\n');
  });
};

var get = new Promise(function(resolve,reject){
  var data;
  var i = Math.round(10 * Math.random());
  var  sql = 'SELECT result FROM pic WHERE id=' + i;
  connection.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR]');
      reject(err.message);
    } else {
      resolve(result[0].result);
    }
});

});
module.exports = {
  add : add,
  get : get
};
