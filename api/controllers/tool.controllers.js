
var fs = require('fs');
var path = require('path');
const uuid = require('uuid');



module.exports.respondnew = async function (req, res) {

    console.log("banana")

    name = ['Kevin', 'Hart']

    try {
        item = await yolo(name);
        console.log(item)
    }
    catch(err) {
        console.log(err);
    }
   
    console.log("orange")
}

var yolo = function (name) {
    return new Promise(function (resolve, reject) {

        path123 = __dirname.replace("/controllers", "/controllers/compute_input.py")
        console.log("path123", path123)

        var spawn = require("child_process").spawn; 
        var process = spawn('python', [path123, name[0], name[1]] ); 
    
        process.stdout.on('data', function(data) { 
            console.log(data.toString()); 
        })
        
        process.stdout.on('end', function(data){
            resolve("success")
        });

    });
}



module.exports.respond = async function (req, res) {

    try {
        console.log("files", req.files);

        folderPath = await createFolder(req.files);
        console.log("folderPath", folderPath);

    }
    catch (err) {
        console.log(err);
        res.json(err);
    }

    console.log("banana")

    try {
        item = await yolo(folderPath);
        console.log(item)
    }
    catch(err) {
        console.log(err);
    }
   
    console.log("orange")
    
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


analyzeFiles = function (folderPath) {
    return new Promise(function (resolve, reject) {
  
        var pythonFilePath = __dirname.replace("/controllers", "/controllers/SemRush_Excel.py")
        console.log('pythonFilePath', pythonFilePath)

        var spawn = require('child_process').spawn;
        var process = spawn('python', ["./SemRush_Excel.py", folderPath] );

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


var yolo123 = function (name) {
    return new Promise(function (resolve, reject) {

        path123 = __dirname.replace("/controllers", "/controllers/compute_input.py")
        console.log("path123", path123)

        var spawn = require("child_process").spawn; 
        var process = spawn('python', [path123, name[0], name[1]] ); 
    
        process.stdout.on('data', function(data) { 
            console.log(data.toString()); 
        })
        
        process.stdout.on('end', function(data){
            resolve("success")
        });

    });
}



