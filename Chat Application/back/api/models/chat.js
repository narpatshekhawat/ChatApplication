var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
  room: String,
  name: String,
  message: String,
  reply_message : String ,
  reply_to : String,
  img: { 
    data: Buffer, 
    contentType: String 
  },
  updated_at: { type: Date, default: Date.now },
  likes : [{ 
      user_name : String
   }],
   likesCount : Number,
   isImage : {
     type : Boolean,
     default : false
   }
});

module.exports = mongoose.model('chats', ChatSchema);
