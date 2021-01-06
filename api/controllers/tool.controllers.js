var fs = require('fs');
var path = require('path');
var JSONtoCSV = require("json2csv").parse;
var CSVtoJSON = require('csvtojson');

var S3 = require('../functions/S3.functions.js');



module.exports.respond = async function (req, res) {

    try {
        data = await readAllCSVs(req.files);
        console.log("yooo", data);
        res.json("files have been uploaded.")
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }

    console.log(apple)
}


readAllCSVs = async function (files) {
    return new Promise( function (resolve, reject) {

        var output = [];

        if(files[0]) {

            for (file of files) {

                console.log(file);
        
                CSVtoJSON()
                .fromFile(file.path)
                .then(function(object) {
                    output.push(object);
                    //fs.unlinkSync(req.file.path);
                })
        
            }
            console.log("tree", output)
            resolve(output);
        }
        else {
            reject("There are no files")
        } 
    });
}