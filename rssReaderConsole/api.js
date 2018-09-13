const objectId = require("mongodb").ObjectId;

module.exports.insert2DbChannel = function(rss, sourceUrl, db){
    const insObj = {};
    return new Promise((resolve, reject)=>{
        insObj.title = rss.channel[0].title[0];
        insObj.description = rss.channel[0].description[0];
        insObj.link = rss.channel[0].link[0];
        insObj.sourceURL = sourceUrl;
        db.collection("rssInfo").insertOne(insObj, (err, result)=>{
            if(err){
                console.log(err);
                return reject(err);
            }else{
                console.log(result.insertedId);
                insert2DbItemsNoDuplicates(rss, result.insertedId.toString()).then(()=>{
                    return resolve(result.insertedId);    
                }).catch((err)=>{
                    console.log(err);
                    return reject(err);
                });
            }
        });
    });
}

module.exports.insert2DbItems = function(rss, chanId, db){
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
module.exports.readChannelById = function(id, db){
    return new Promise((resolve, reject)=>{
        db.collection("rssInfo").findOne({"_id": objectId(id)}, (err, doc)=>{
            if(err)
                return reject(err);
            else
                resolve(doc);    
            
        });
    });
            
}
module.exports.readItemsById = function(id, db){
    return new Promise((resolve, reject)=>{
        db.collection("rssItems").find({"chanId": id}).toArray((err, doc)=>{
            if(err)
                return reject(err);
            else
                resolve(doc);    
            
        });
    });    
}
 function insert2DbItemsNoDuplicates(rss,chanId, db){
    let pr = [];
    const item = rss.channel[0].item;
    for(let i=0; i<item.length; i++){
        pr.push(new Promise((resolve, reject)=>{
            let insObj = {
                chanId: chanId,
                title: item[i].title,
                description: item[i].description,
                link: item[i].link,
                pubDate: item[i].pubDate,
                category:  item[i].category 
            };
            console.log(insObj);
            db.collection("rssItems").update({"title":item[i].title}, insObj, {upsert: true}, (err, result)=>{
                if(err)
                return reject(err);
            else
                resolve(result);
            })
        }))
    }
    return Promise.all(pr);
    
}
module.exports.insert2DBItemsNoDuplicates = insert2DBItemsNoDuplicates;