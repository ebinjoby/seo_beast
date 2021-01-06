
var express = require('express');
var cors = require('cors');

var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./api/routes/map.js');

app.set('port', 80);

app.use(cors());
//app.options('*', cors());

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use('/api', routes);

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});


