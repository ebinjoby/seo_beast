
var ctrlTool = require('../controllers/tool.controllers.js');

var server = require('../../app.js');
app = server.server();

var express = require('express');
var router = express.Router();


var multer = require('multer');
const { TemporaryCredentials } = require('aws-sdk');

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + ' - ' + file.originalname);
    }
});

var upload = multer({ storage: storage });


var monitor = function(functionVar, callback){

    var temp = [];
    var messages = [];

    const interval = setInterval(function() {

        messages = functionVar

        if (messages.length != temp.length) {

            newtemp = messages.slice(temp.length, messages.length)

            for (item in newtemp) {

                data = newtemp[item];

                if (typeof callback == "function") {
                    callback(data);
                }
            }
        }
        temp = [...messages]

    }, 50);
}



//////////////////////////////////////////////////////////////////////////////////////////////////


router
.route('/seo_tool/:folderName')
.get(ctrlTool.downloadOutput)
.post(upload.array('file', 30), ctrlTool.uploadInput)


router.ws('/seo_tool_WS', function(ws, req) {
    
    console.log('WS Client Connected');
    ws.send('Connection to SEO Tool web-socket server established. Welcome new client!')

    monitor(ctrlTool.messages(), function(data) {

        if (ws.readyState == 1) {
            ws.send(data);
        }
    })

    ws.on('message', function(msg) {
        console.log('Message from WS client: ', msg);
        ws.send('Message Recieved: ' + msg)
    });

    ws.on('close', function() {
        console.log('WS Client Disconnected');
        ctrlTool.messagesReset()
    });
});
 

//////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;


 