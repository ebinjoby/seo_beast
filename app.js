
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');


var express = require('express');
var app = express();

var expressWS = require('express-ws');
expressWS(app);

module.exports.server = function() {
    return app
}


app.set('port', 80);

app.use(cors());

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());


var routes = require('./api/routes/map.js');
app.use('/api', routes);


var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
    console.log(server.address())
});
 

