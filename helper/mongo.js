var mongo = require("mongodb")

let url_db = "mongodb://root:x14@ds227325.mlab.com:27325/x-fc"

function connection(){
  return mongo.connect(url_db)
    
}

 
let base ;

function create (path,getCode,error){
  let url
  connection().then(function(db){
    base  = db;
     url = db.collection("url")
    return url.find({path : path } )
  }).
  then(function (cursor){
  cursor.toArray(function(err,data){
    if (data.length > 0 ){
      error({type : "duplicate", message:"url already exist", data : data[0]})
    }
    else createID(path,url,getCode);
  })
})
}
 
function close(){
  base.close();
}

function createID(path,url,getCode){
 return  Promise.resolve(url.find({code : {$exists : true}}, { _id:0,code:1}))
           .then(function( cursor){
             cursor.toArray(function(err,data){
               let codes = data.map(item=> item.code)
               let id  = newID(codes);
               url.insert({path : path , code : id},function(err,data){
               close();
                  getCode({path : path , code  : id})})
             })
 })
}
                

function newID(codes){
  let randomID = n => Math.round(Math.random() * 10 ** n)
  let id  = 0;
  while (codes.includes(id)){
    id = randomID(4);
  }
  return id;
}
 

function get(code,getUrl,error){
  connection().then(function(db){
   let  url = db.collection("url")
   url.findOne({code : {$eq : parseInt(code)} } ,{_id:0,path : 1}).then(function(data){
      close();
      if (data) getUrl(data)
      else error({ message : "code don't exist" ,code  : code })})
  })
}
               
                                                    
    
 
module.exports={ create : create ,get : get }