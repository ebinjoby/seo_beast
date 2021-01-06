
var mysql = require('mysql');

module.exports.pool = mysql.createPool({
    connectionLimit : 1000, //important
    host     : 'hypatia2.csizbuwolmkn.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'admin',
    password : 'LT_PizzaBagel16',
    database : 'Hypatia_Database'
});


// old-one --> hypatia-instance.csizbuwolmkn.us-east-1.rds.amazonaws.com


