
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
.route('/seo_tool/:folderName')
.get(ctrlTool.downloadOutput)
.post(upload.array('file', 30), ctrlTool.uploadInput)


//////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;


