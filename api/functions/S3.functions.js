
const fs = require('fs');
var aws = require('../databases/awsS3.js');


module.exports.uploadFile = function (transferInfo, callback) {

    fs.readFile(transferInfo.localPath.concat("/").concat(transferInfo.fileName), function (err, data) {

        if (err) throw err;

        const params = {
            Bucket: transferInfo.bucket,
            Key: transferInfo.folderPath.concat("/").concat(transferInfo.fileName),
            Body: data
        };

        aws.s3.upload(params, function (S3err, S3data) {
            if (typeof callback == "function") {
                callback(S3err, S3data);
            }
        });

    });
}

module.exports.downloadFile = function (transferInfo, callback) {

    const params = {
        Bucket: transferInfo.bucket,
        Key: transferInfo.folderPath.concat("/").concat(transferInfo.fileName)
    };

    aws.s3.getObject(params, function (S3err, S3data) {

        if (S3err) throw S3err

        console.log(S3data.Body)

        fs.writeFile(transferInfo.localPath.concat("/").concat(transferInfo.fileName), S3data.Body, function (err, data) {
            var data = {
                downloadPath: transferInfo.localPath.concat("/").concat(transferInfo.fileName),
                AcceptRanges: S3data.AcceptRanges,
                LastModified: S3data.LastModified,
                ContentLength: S3data.ContentLength,
            };
            if (typeof callback == "function") {
                callback(err, data);
            }
        });

    });
}


