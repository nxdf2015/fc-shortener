
var express = require('express');
var path  = require("path");
var mongo  = require("./helper/mongo.js")
// api mongo {create ,get }
 
var app = express();
 


let http = /^\/http:\/\/\w+\.\w+\.\w{3}/
 
app.use(express.static('public'));

 
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



app.get(/^\/\d+$/,function(req,res){
  let getUrl = ({path}) =>  {
   res.redirect(path);
   res.end()
  }
  let error = ({message,code} )=> {
    res.write(`error : ${message}  code : ${ code}`)
    res.end()
  }
  
  mongo.get(req.path.slice(1),getUrl,error)
})

app.get(http,function(req,res){
 
  let path = req.path.slice(1);
  
  let error = result  => {
    let message ;
    switch(result.type){
      case "duplicate":
        const {data , code ,message } = result
        message = `path : ${data.path}  ${message}  with code : ${data.code}`
        break;
      case "error":
        message = `error : ${data.message}`
                      }
    res.write(message)
    res.end();
  }
  
  let getCode = ({code,path}) => {
    res.write(JSON.stringify({path : path ,  code : code })) 
    res.end();
  }
  
  mongo.create(req.path.slice(1),getCode,error) 
})


app.get(/\.*/,function(req,res){
  res.sendFile(path.join(__dirname,"public/error.html"))
})
 
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


 
