'use strict'
const express = require("express");
const app = express();
const MongoClient    = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const config = require("./config");
    
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(config.url, (err, client) => {
    if(err) console.log(err)
    require('./routes')(app, client.db(config.dbName));
    var port = process.env.PORT || 3000;
    app.listen(port, function(err){
        if(err) console.log(err)
        console.log(`Server started at port: ${port}`);
    })
});
