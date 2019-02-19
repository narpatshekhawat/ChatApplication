const Chat = require("../models/chat");
var multer = require('multer');
var fs = require('fs');
//get all chat

exports.get_chat = (req,res) => {
    
    Chat.find({ room: req.params.room }).exec((err, chats) => {
        
        if(err){
            res.send('error');
        }else if(chats == null){
            res.json({"status" : false});
         }
         else{
             res.json(chats);
            
         }
    }); 
}

//save chat
exports.save_chat =  (req,res) => {
    
    console.log(req.body.message.length);
    
    var chat = new Chat();
    chat.room = req.body.room;
    chat.name = req.body.name;
    chat.reply_to = req.body.reply_to;
    chat.reply_message = req.body.reply_message;
    chat.likes = req.body.likes;
    chat.likesCount = req.body.likesCount;
    if(req.body.message.length > 10000)
    {
      chat.isImage = true;
    }
    chat.message = req.body.message;
    chat.save((err,result) => {
        if(err){
            return next(err);
        }
        else{      
         res.send(result);
        }
    })
    
}

exports.save_like = (req,res) => {

  Chat.findOne({ _id : req.body.msg_id }, (err,obj) =>{
    if(err)
    console.log(err);
    else{
      if(!obj){
        res.status(404).send();
      } else{
        let userLikeFoundStatus = false;
        console.log("obj",obj);
        let me = obj;
        console.log("msg_id" ,req.body.msg_id);
        console.log("user_name",req.body.user_name);
        if(req.body.msg_id){
          Chat.find({$and : [{_id : req.body.msg_id},{likes : {"$elemMatch": {user_name: req.body.user_name}}}]}, {"likes.user_name": 1}).exec((err,obj)=>{
              console.log("result",obj);
              if(obj.length == 0){
                userLikeFoundStatus = false;
                isLikeAlreadyExist(userLikeFoundStatus);  
              } else{
                userLikeFoundStatus = true;
                isLikeAlreadyExist(userLikeFoundStatus);
              }
          });
          function isLikeAlreadyExist(value)
          { 
            if(!value){
              console.log('saving');
              obj.likes.push({ user_name : req.body.user_name});
              obj.likesCount = obj.likes.length - 1;
              console.log("size of like : ",obj.likes.length);
              obj.save((err,obj) => {
                if(err)res.send(err);
                else
                res.json({"status" : "true"});
              });
            }
            else{
               res.json({"status" : "false"});
            } 
          }
        }
        

      }
    }
  });
  
}

var store = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,'./uploads');
    },
    filename : function(req,file,cb){
      cb(null, Date.now() + '.' + file.originalname);
    }
  });


var upload = multer({ storage : store }).single('file');
//save image
exports.save_image = (req,res) => {
    
    upload(req, res, function (err) {
        console.log("upload" , req.file.destination);
        console.log('path',req.file.path);
        
        var chat = new Chat();
        chat.name = req.body.name;
        chat.room = req.body.room;
        chat.message = req.body.message;
        chat.reply_message = '';
        chat.reply_to = '';
        chat.likesCount = 0;
        chat.img.data = fs.readFileSync(req.file.path);
        chat.img.contentType = req.file.mimetype;

        chat.save().then((chat,err) =>{
          console.log('err',err);
         
          if (err) {
            console.log(err);
            return;
          }else{
            return res.json(chat)
          }
        }); 
        console.log('file uploaded successfully');
      });
}

function b64toBlob(b64Data) {
  var contentType = '';
  var sliceSize = 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  // var blob = new Blob(byteArrays, {type: contentType});
  var blob = new Blob(byteArrays);
  return blob;
}

