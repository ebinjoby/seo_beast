
var ctrlArticles = require('../controllers/article.controllers.js');

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
.route('/projects/:project_id/articles/upload')
.get(ctrlArticles.uploadTemplate)
.post(upload.array('file', 30), ctrlArticles.upload)


//////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;


