var fs = require("fs")

var walk = function(dir, done) {
    var progress = 0;
    var res = {};
    res.files = [], res.dirs = [];

    var success = function() {
        if(progress == 0) {
            done(res);
        }
    };
    
    var dirGetContents = function(dir) {
        progress++; 
        fs.readdir(dir, function(err, list) {
        if (err) {
            done(err);
        }
        else { 
            list.forEach(function(file) {
            var path = dir + "/" + file;
            progress++; 
            fs.stat(path, function(err, stat) {
                if (err) {
                    done(err);
                }else{
                    if (stat && stat.isDirectory()) {
                        res.dirs.push(path)
                        dirGetContents(path); 
                    }else {
                        res.files.push(path);
                    }
                    progress--; success(); 
                    }
                });
            });
            progress--; success(); 
            }
        });
    };
    dirGetContents(dir);
};

if(process.argv.length > 2){
    walk(process.argv[2], function(err, list){
        if(!err) console.log(list)
            else
                console.log(err);
    })  
}else{
    console.log("No directory specified. Exiting")
}
