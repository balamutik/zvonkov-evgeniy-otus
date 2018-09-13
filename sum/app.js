//Реализации функции суммирования
//функция sum может вызываться неграниченное кол-во раз
//При отсутствии аргументов выводит сумму предыдущих вызовов
//Запуск: 
//$ cd sum && npm install
//$ node app.js Далее в браузере запустить http://localhost:3000

var express = require("express"),
    app = express();
    
app.get("/",(req, res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("*",(req, res)=>{
    res.status(404).send("404 - NOT FOUND");
})

app.listen(3000, function(){
    console.log("DZ server is running on 3000 port");
})




