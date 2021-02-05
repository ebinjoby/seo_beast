
var fs = require('fs');
var path = require('path');
const uuid = require('uuid');
const {PythonShell} =require('python-shell'); 

var messages = [];

module.exports.messages = function() {
    return messages
}

module.exports.messagesReset = function() {
    messages = [];
}
 

module.exports.downloadOutput = function (req, res) {

    var downPath = __dirname.replace("/api/controllers", "/uploads")
    var fileName = "output.xlsx";
    var file = path.join(downPath, req.params.folderName, fileName);

    res.download(file, Date.now().toString().concat(" ").concat(fileName), async function (err) {

        if (err) {
            console.log(err);
        } 
        else {
            try {
                result = await deleteFolder(req.params.folderName);
                console.log(result);
                console.log("File download successful");
            }
            catch (err) {
                console.log(err);
            }
        }
    })
}



module.exports.uploadInput = async function (req, res) {

    try {
        result = await deleteFolder(req.params.folderName);
        console.log(result);
    }
    catch (err) {
        console.log(err);
    }
    try {
        console.log("files", req.files);

        folderPath = await createFolder(req.files);
        console.log("folderPath", folderPath);

    }
    catch (err) {
        console.log(err);
        res.json(err);
    }

    try {
        item = await analyzeFiles(folderPath);
        console.log('Output Folder Name: ', item[0])
        res
            .status(200)
            .json({'message' : 'SEO Tool Process Complete!', 'location' : item[0]});
    }
    catch(err) {
        console.log(err);
    }

    setTimeout(async function(folderName) { 

        try {
            result = await deleteFolder(folderName);
            console.log(result);
        }
        catch (err) {
            console.log(err);
        }
    
    }, 172800000, item[0]);
   
}





deleteFolder = function(folderName) {
    return new Promise(async function (resolve, reject) {

        if (folderName != 'NONE') {

            uploadsPath = __dirname.replace("/api/controllers", "/uploads")
            folderPath = path.join(uploadsPath, folderName);

            fs.rmdir(folderPath, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(folderName + ' has been deleted!')
                }     
            });
        }
        else {
            resolve('No folder to delete.')
        } 
    });
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
                    fs.unlinkSync(file.path)
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

        var pythonFilePath = __dirname.replace("/controllers", "/functions")

        let options = { 
            mode: 'text', 
            pythonOptions: ['-u'], // get print results in real-time 
            scriptPath: pythonFilePath, //If you are having python_test.py script in same folder, then it's optional. 
            args: [folderPath] //An argument which can be accessed in the script using sys.argv[1] 
        }; 
    
        let pyshell = new PythonShell('SemRush_Excel.py', options)
    
        pyshell.on('message', function (message) {

            if (message != '') {
                messages.push(message); // ######
            }
            
            console.log(message);
        });
          
        // end the input stream and allow the process to exit
        pyshell.end(function (err, code, signal) {
            if (err) throw err;
            
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


