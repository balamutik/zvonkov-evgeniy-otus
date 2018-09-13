const MongoClient    = require('mongodb').MongoClient;
const api = require('./api')
const request = require('request');
const xml2js = require('xml2js').parseString;
const config = require("./config");

MongoClient.connect(config.url, (err, client) => {
    if(process.argv.length>2){
        const url = process.argv[2]; 
        console.log(`==>Getting ${url}`);
        request(url, (err, resp, body)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log("==>Getting - OK!");
            console.log("===>Parsing...");
            xml2js(body, (err, result)=>{
            //console.log(result.rss.channel[0]);
                if(err){
                   console.log(err);
                   return;
                }
                console.log("===>Parsing - OK!")
                let db = client.db(config.dbName)
                api.insert2DbChannel(result.rss, url, db).then((channel, docs)=>{
                    console.log("======================INSERTION RESULT======================");    
                    console.log(`Channel id: ${channel}`);
                    console.log("Succesfully saved");
                    process.exit(0);
                })  
           })   
        })
    }else{
        console.log("USAGE: node app.js URL");
        process.exit(0);
    }

});
