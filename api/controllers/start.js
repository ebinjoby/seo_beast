


var yolo = function (name) {
    return new Promise(function (resolve, reject) {

        var spawn = require("child_process").spawn; 
        var process = spawn('python', [__dirname.replace("/controllers", "/controllers/compute_input.py"), name[0], name[1]] ); 
    
        process.stdout.on('data', function(data) { 
            console.log(data.toString()); 
        })
        
        process.stdout.on('end', function(data){
            resolve("success")
        });

    });
}

test = async function() {

    name = ['Ram', 'Sastry']

    try {
        item = await yolo(name);
        console.log(item)
    }
    catch(err) {
        console.log(err);
    }
}

test();


