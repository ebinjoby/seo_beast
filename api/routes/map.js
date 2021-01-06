
var ctrlTool = require('../controllers/tool.controllers.js');

var express = require('express');
var router = express.Router();

var multer = require('multer');

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + ' - ' + file.originalname);
    }
});

var upload = multer({ storage: storage });



//////////////////////////////////////////////////////////////////////////////////////////////////


router
.route('/analyze')
.post(upload.array('file', 30), ctrlTool.respond)


//////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;


