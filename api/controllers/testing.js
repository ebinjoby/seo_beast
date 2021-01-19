var path = require('path');
const uuid = require('uuid');
const fs = require('fs')

var downPath = __dirname.replace("/api/controllers", "/uploads")

console.log("1", downPath)

var fileName = uuid.v1() ;
var file = path.join(downPath, fileName);

fs.mkdirSync(file)

console.log("2", file)



/*

var fs = require('fs');
var path = require('path');
var JSONtoCSV = require("json2csv").parse;
var CSVtoJSON = require('csvtojson');

//import { Series, DataFrame } from 'pandas-js';

var Series = require('pandas-js').Series;
var DataFrame = require('pandas-js').DataFrame;


var S3 = require('../functions/S3.functions.js');
const { AccessAnalyzer } = require('aws-sdk');



module.exports.respond = async function (req, res) {

    

    try {
        console.log("files", req.files);

        data = await readAllCSVs(req.files);

        console.log(data)

        result = await analyze(data);


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


analyze = function (data) {
    return new Promise(function (resolve, reject) {

        var temp = {};     

        for (list in data) {
            temp[list] = new DataFrame(data[list])
        }


        var output = {};

        for (list in temp) {
            output[list] = temp[list].to_json({orient: 'records'})
        }

        resolve(output);
    });
}

*/

