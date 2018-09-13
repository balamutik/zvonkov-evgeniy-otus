module.exports = function(app, db){
    const request = require("request");
    const xml2js = require("xml2js").parseString;
    const objectId = require("mongodb").ObjectId;
    
    app.get('/channel/:id', function(req, res){
        let id = req.params.id;
        readChannelById(id).then((doc)=>{
            res.send({status: "OK", doc: {
                id: doc._id,
                title: doc.title,
                description: doc.description,
                link: doc.link
            }});
        }).catch((err)=>{
            console.log(err);
            res.status(500).send({status: "ERROR", error: "Internal server error"});
        });
        
    });
    
    app.post('/add', (req, res)=>{
        let url = req.body.url || req.query.url; // Я не знаю почему так, но вместо body кладет параметры в query. Если сломается поменять на body
        request(url, (err, resp, body)=>{
            if(err){
                console.log(err);
                res.send({status: "ERROR", error: "CONNECTION ERROR OR INVALID URL"});
                return;
            }
            xml2js(body, (err, result)=>{
            //console.log(result.rss.channel[0]);
                if(err){
                   console.log(err);
                   res.send({status: "ERROR", error: "BAD XML"});
                   return;
                }
                insert2DbChannel(result.rss, url).then((result)=>{
                    res.send({status: "OK", id: result});
                })  
           })   
        }) 
    });
    
    app.get("/channel/:channelId/items", (req, res)=>{
        let id = req.params.channelId;
        readItemsById(id).then((doc)=>{
            console.log(doc);
            res.send({status: "OK", doc: doc});
        }).catch((err)=>{
            console.log(err);
            res.status(500).send({status: "ERROR", error: "Internal server error"});
        });
    });
    
    app.post("/channel/:channelId/items", (req, res)=>{
        let chanId = req.params.channelId;
        readChannelById(chanId).then((doc)=>{
            request(doc.sourceURL,(err, resp, body)=>{
                if(err){
                    console.log(err);
                    res.send({status: "ERROR", error: "CONNECTION ERROR OR INVALID URL"});
                    return; 
                }
                xml2js(body, (err, result)=>{
                    if(err){
                       console.log(err);
                       res.send({status: "ERROR", error: "BAD XML"});
                       return;
                    }
                    insert2DbItems(result.rss, chanId.toString()).then((result)=>{
                        res.send({status: "OK", id: result});
                    })
                });
            });
        }).catch((err)=>{
            console.log(err);
            res.send({status: "ERROR", error: "Invalid channel id or DB problems"})
        });
    });
    app.get('/', function(req, res){
        let msg = "Use API:<br>\
                   POST /add - param URL, Content-Type: application/json. Decription: add rss from url to db<br>\
                   POST /channel/id/items - where id = id from /add request, Decription: adds items from channel with channel id<br>\
                   GET /channel/id, where id = id from /add request, Decription: shows channel info by id<br>\
                   GET /channel/id/items, where id = id from /add request, Decription: shows items from channel with channel id";
        res.send(msg);
    });
    
    function insert2DbChannel(rss, sourceUrl){
        const insObj = {};
        return new Promise((resolve, reject)=>{
            insObj.title = rss.channel[0].title[0];
            insObj.description = rss.channel[0].description[0];
            insObj.link = rss.channel[0].link[0];
            insObj.sourceURL = sourceUrl;
            db.collection("rssInfo").insertOne(insObj, function(err, result){
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    console.log(result.insertedId);
                    insert2DbItems(rss, result.insertedId.toString()).then(()=>{
                        return resolve(result.insertedId);    
                    }).catch((err)=>{
                        console.log(err);
                        return reject(err);
                    });
                }
            });
        });
    }
    
    function insert2DbItems(rss, chanId){
        const insObj = [];
        console.log("CHANID: "+chanId);
        return new Promise((resolve, reject)=>{
            let item = rss.channel[0].item;
            for(let i = 0; i < item.length; i++)
                insObj[i] = {
                    chanId: chanId,
                    title: item[i].title,
                    description: item[i].description,
                    link: item[i].link,
                    pubDate: item[i].pubDate,
                    category:  item[i].category 
                };
            db.collection("rssItems").insertMany(insObj, (err, result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    console.log("INSERTED! " + result.insertedCount);
                    return resolve(result.insertedId);
                }
            });
        });
    }
    function readChannelById(id){
        return new Promise((resolve, reject)=>{
            db.collection("rssInfo").findOne({"_id": objectId(id)}, (err, doc)=>{
                if(err)
                    return reject(err);
                else
                    resolve(doc);    
                
            });
        });
                
    }
    function readItemsById(id){
        return new Promise((resolve, reject)=>{
            db.collection("rssItems").find({"chanId": id}).toArray((err, doc)=>{
                if(err)
                    return reject(err);
                else
                    resolve(doc);    
                
            });
        });    
    }
}