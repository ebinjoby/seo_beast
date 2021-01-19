
var fs = require('fs');
var path = require('path');
const uuid = require('uuid');

var yolo = function () {
    return new Promise(function (resolve, reject) {

        var spawn = require("child_process").spawn; 
        var process = spawn('python', ["./compute_input.py", 'Ram', 'Sastry'] ); 
    
        process.stdout.on('data', function(data) { 
            console.log(data.toString()); 
        } ) 

    });
}

module.exports.respond = async function (req, res) {

    try {
        await yolo();
    }
    catch(err) {
        console.log(err);
    }
   
    console.log("orange")
}




module.exports.respondOG = async function (req, res) {

    try {
        console.log("files", req.files);

        folderPath = await createFolder(req.files);
        console.log("folderPath", folderPath);

    }
    catch (err) {
        console.log(err);
        res.json(err);
    }

    test();

    
    var pythonFilePath = __dirname.replace("/controllers", "/functions/SemRush_Excel.py")
    console.log('pythonFilePath', pythonFilePath)

    var spawn = require('child_process').spawn;
    var process = spawn('python', ["./SemRush_Excel.py", folderPath] );

    console.log('yoyoyo')

    process.stdout.on('data', function(data){
        console.log(data.toString());
    });

    process.stdout.on('end', function(){

        try {
            if (fs.existsSync(path.join(folderPath, 'Output.xlsx'))) {
                res.json({ message: "Files have been processed.", location: folderPath.split("/").slice(-1) })
            }
        } 
        catch(err) {
            console.log(err);
            res.json(err);
        }
    });
   

    console.log("orange")
}

test = function() {

    var spawn = require("child_process").spawn;
    var yolo = spawn('python', ["./compute_input.py", 'Ram', 'Sastry'] ); 

    yolo.stdout.on('data', function(data) { 
        console.log(data.toString()); 
    } ) 
}


createFolder = function (files) {
    return new Promise(async function (resolve, reject) {

        uploadsPath = __dirname.replace("/api/controllers", "/uploads")
        folderPath = path.join(uploadsPath, uuid.v1());

        fs.mkdirSync(folderPath)

        if(files[0]) {

            for (file of files) {

                try {
                    output = await moveFile(file);
                }
                catch(err) {
                    console.log(err);
                    reject(err);
                }
            }
            resolve(folderPath);
        }
        else {
            reject("There are no files")
        } 
    });
}


moveFile = function (file) {
    return new Promise(function (resolve, reject) {

        if(file) {

            fs.copyFile(path.join(uploadsPath, file.filename), path.join(folderPath, file.originalname), function(err) {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve();
                }
            }); 
        }
        else {
            reject("There are no files")
        } 
    });
}


analyze = function (folderPath) {
    return new Promise(function (resolve, reject) {

        var spawn = require('child_process').spawn;
        var pythonFilePath = __dirname.replace("/controllers", "/functions/SemRush_Excel.py")
        console.log('pythonFilePath', pythonFilePath)

        var process = spawn('python', ["./SemRush_Excel.py", folderPath] );

        console.log('yoyoyo')

        process.stdout.on('data', function(data){
            console.log(data.toString());
        });

        process.stdout.on('end', function(){

            try {
                if (fs.existsSync(path.join(folderPath, 'Output.xlsx'))) {
                    resolve(folderPath.split("/").slice(-1));
                }
            } 
            catch(err) {
                reject(err);
            }
        });

    });
}



