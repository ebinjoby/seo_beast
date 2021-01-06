var fs = require('fs');
var path = require('path');
var JSONtoCSV = require("json2csv").parse;
var CSVtoJSON = require('csvtojson');

var S3 = require('../functions/S3.functions.js');



module.exports.respond = async function (req, res) {

    try {
        console.log("files", req.files);

        data = await readAllCSVs(req.files);

        console.log("yooo", data);

        res.json("files have been uploaded.")
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }

    console.log("apple")
}


readAllCSVs = function (files) {
    return new Promise(async function (resolve, reject) {

        var output = {};

        if(files[0]) {

            for (file of files) {

                try {
                    output = await readCSV(file, output);
                }
                catch(err) {
                    console.log(err);
                    reject(err);
                }
            }
            resolve(output);
        }
        else {
            reject("There are no files")
        } 
    });
}


readCSV = function (file, output) {
    return new Promise(function (resolve, reject) {

        if(file && output) {

            CSVtoJSON()
            .fromFile(file.path)
            .then(function(object) {
                output[file.originalname.split('.csv')[0]] = object;
                resolve(output);
                //fs.unlinkSync(req.file.path);
            })  
        }
        else {
            reject("There are no files")
        } 
    });
}




