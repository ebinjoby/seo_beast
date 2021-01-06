
var csv = require('fast-csv');
var fs = require('fs');
var path = require('path');
var JSONtoCSV = require("json2csv").parse;
var CSVtoJSON = require('csvtojson');

var S3 = require('../functions/S3.functions.js');
var SQL = require('../functions/SQL.functions.js');

 


//  download upload-template  #################################################################

module.exports.uploadTemplate = function (req, res) {

    var downPath = __dirname.replace("/api/controllers", "/downloads")

    var downloadInfo = {
        localPath: downPath,
        fileName: "Article-Upload.csv",
        bucket: "hypatia-files",
        folderPath: "for-download"
    }

    var file = path.join(downPath, downloadInfo.fileName);

    S3.downloadFile(downloadInfo, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.download(file, Date.now().toString().concat(" ").concat(downloadInfo.fileName), function (err) {

                if (err) {
                    console.log(err);
                } else {
                    console.log("File download successful");
                    fs.unlinkSync(file);
                }
            })
        }
    });
};

//  download articles-list  #################################################################

module.exports.downloadArticles = async function (req, res) {

    try {
        var csvFile = await getArticlesCSV(req.params.project_id);

        var downPath = __dirname.replace("/api/controllers", "/downloads")
        var fileName = "Project-Articles.csv";
        var file = path.join(downPath, fileName);

        fs.writeFile(file, csvFile, function (err) {
            if (err) {
                console.log(err);
                res
                    .status(400)
                    .json(err);
            }
            else {
                res.download(file, Date.now().toString().concat(" ").concat(fileName), function (err) {

                    if (err) {
                        console.log(err);
                    } else {
                        console.log("File download successful");
                        fs.unlinkSync(file);
                    }
                })
            }
        });
    }
    catch {
        console.log(err);
        res
            .status(400)
            .json(err);
    }
};

getArticlesCSV = function (project_id) {
    return new Promise(function (resolve, reject) {

        SQL.selectArticlesWhere(project_id, function (err, data) {
            if (err) {
                console.log(err);
                res
                    .status(400)
                    .json(err);
            }
            else {
                articles = data.map(function (object) { return object.headline; });
                data = data.map(function (object) {
                    try {
                        var newDate = new Date(object.date_published).toISOString().substr(0, 10);
                    } catch (err) {
                        reject(err);
                    }
                    object.date_published = newDate;
                    return object;
                });
                data = data.map(function (object) {
                    return {
                        date: object.date_published,
                        url: object.url,
                        headline: object.headline,
                        author: object.first_name + " " + object.last_name,
                        source: object.outlet_name,
                        potential_reach: object.potential_reach,
                        keywords: object.keywords
                    }
                })
                console.log(data)
                var csvFile = JSONtoCSV(data, { fields: ["date", "url", "headline", "author", "source", "potential_reach", "keywords"] });
                resolve(csvFile);
            }
        });
    });
}



//  upload articles-list  #################################################################

module.exports.upload = async function (req, res) {

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

processArticleData = async function (fileRows, footer, project_id) {
    return new Promise(async function (resolve, reject) {

        for (const data of fileRows) {
            if (data[footer.indexOf('url')] != '') {
                try {
                    var newDate = null;
                    newDate = new Date(data[footer.indexOf('date')]).toISOString().substr(0, 10);
                } catch (err) {
                    reject(err);
                }
                var input = {
                    article_id: null,
                    person_id: null,
                    outlet_id: null,
                    user_id: 'ebin1995-681a-11ea-b0f2-a3065bee3b10',
                    project_id: project_id,
                    date: newDate,
                    url: data[footer.indexOf('url')],
                    headline: data[footer.indexOf('headline')],
                    author_f_name: data[footer.indexOf('author')].trim().split(' ').slice(0, 1).join(' ').trim(),
                    author_l_name: data[footer.indexOf('author')].trim().split(' ').slice(1).join(' ').trim(),
                    outlet_name: data[footer.indexOf('source')],
                    potential_reach: data[footer.indexOf('potential_reach')],
                    keywords: data[footer.indexOf('keywords')]
                }
                try {
                    result = await ARTICLE.uploadArticle(input);
                    console.log(result);
                } catch (err) {
                    reject(err);
                }
            }

        }
        resolve("SUCCESS : All articles in file have been uploaded to the database.")
    });
}





