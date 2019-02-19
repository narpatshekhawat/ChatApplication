import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { ChatService } from '../chat.service';
import { Chat } from '../chat.model'
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ServerService } from '../server.service';
const URL = 'http://localhost:3000/chat/image'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})


export class ChatComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  uploader:FileUploader = new FileUploader({url : URL});
  newUser = { name: '', room: '' };
  socket = socketIO('http://localhost:3000');
  room = ['Room 1' , 'Room 2' , 'Room 3' , 'Room 4' , 'Room 5'];
  roomSelected;
  isImgReplySelected = false;
  isReplySelected = false;
  roomIsSelected = false;
  msgData = { room: '', name: '', message: '', reply_message : '',reply_to : '', likes : { user_name : ''}, likesCount : 0 };
  chats : Chat[] = [];


  constructor(private serverService : ServerService,
              private chatService : ChatService,
              ) {  }

  ngOnInit() {
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      var user = JSON.parse(localStorage.getItem("user"));
      form.append("message" , '');
      form.append("room" , user.room);
      form.append("name" , user.name);
      let temp = fileItem.file;
      fileItem.file.withCredentials = false;
      temp.room = user.room;
      temp.name = user.name;
      // this.socket.emit('new-img', temp);
     };

     this.uploader.onSuccessItem = (item:FileItem,response:any,status:number,headers:any) =>{
       console.log('on success');
     }
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    
    this.uploader.onCompleteItem = (item: any, response:any, status: any, headers: any) => {
         //console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
         let temp = item.file;
         temp = response as Chat;
         temp = JSON.parse(response);
         this.socket.emit('new-img', temp);
        //  console.log(response);
     };

    var me = this;
    this.socket.on('hello', (data) => {
      console.log('Greeting : ' , data);
    });

    this.socket.on('connect', () => {
      console.log(this.socket.connected); // true
    });

    this.socket.on('connect', () => {
      console.log(this.socket.disconnected); // false
    });

    var user = JSON.parse(localStorage.getItem("user"));
    
    if(user!==null) {
      this.getChatByRoom(user.room);
      this.msgData = { room: user.room, name: user.name, reply_message :'', reply_to : '' , message: '' , likes : { user_name : '' } , likesCount : 0 };
      this.roomIsSelected = true;
    }

    this.socket.on('save-like', function(){
      me.getChatByRoom(me.msgData.room);
      console.log('save like');
    })
    
    this.socket.on('new-message', function (data) {
      if(data.message.message == "Left this room"){
        me.chats.push(data.message);
        return;
      }
      if(data.message.room === JSON.parse(localStorage.getItem("user")).room) {
        console.log(data.message);
        me.chats.push(data.message);
        var user = JSON.parse(localStorage.getItem("user"));
        this.msgData = { room: user.room, name: user.name, message: '' };
      }
    });

    this.socket.on('new-img', function (data) {
      if(data.room === JSON.parse(localStorage.getItem("user")).room) {
        console.log(data.img.data.data);

        let img = arrayBufferToBase64(data.img.data.data);
        let temp = { _id : data._id, updated_at : data.updated_at, room : data.room, name : data.name, img: { data: img }, message : '', likesCount : 0};
        
        me.chats.push(temp);
        var user = JSON.parse(localStorage.getItem("user"));
        this.msgData = { room: user.room, name: user.name, message: '' };
      }
    });
  }

  sendMsg(){
    console.log(this.msgData);
    this.isReplySelected = false;
    this.isImgReplySelected = false;
    // console.log(b64toBlob(this.msgData.message));
    this.chatService.saveChat(this.msgData).subscribe(
      (result) => {
        this.socket.emit('save-message', result);
        this.msgData.message = "";
        this.msgData.reply_message = '';
        this.msgData.reply_to = '';
      },
      (err) => {
        console.log(err);
      }
    );
  }

  roomSelect(room){
    this.roomSelected = room;
    this.roomIsSelected = true;
  }
  
  joinRoom(room) {
    var date = new Date();
    this.newUser.room = room;
    this.newUser.name = this.serverService.getUserPayload().username;
    console.log(this.newUser);
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, name: this.newUser.name, reply_message : '',reply_to : '', message: '', likes : { user_name : '' }, likesCount : 0}
    this.roomIsSelected = true;
    this.socket.emit('save-message', { room: this.newUser.room, name: this.newUser.name, message: 'Join this room', updated_at: date, reply_message:'' });
  }

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).subscribe(
      (result) => {
        console.log(result);
      let temp : any = result as [];
      let img;
      for(let i=0; i<temp.length; i++)  {
        if(temp[i].message.length == 0)
        {
          img = arrayBufferToBase64(temp[i].img.data.data);
          temp[i].img.data = img; 
        }
        else
        {
          console.log('bye');
         
        }
      }
      
      this.chats = temp;
      
    }, (err) => {
      console.log(err);
    });
  }

  exitRoom(){
    this.roomSelected = '';
    this.roomIsSelected = false;
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { room: user.room, name: user.name, message: 'Left this room', updated_at: date, reply_message:'' });
    localStorage.removeItem("user");
  }

  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
}

  logout(){
    this.chatService.logout();
  }

  likeMessage(obj){
    console.log(obj);
    this.chatService.saveLike(obj).subscribe(
      (result) => {
        console.log(result);
        this.socket.emit("save-like");
      },
      (err) => {
        console.log(err);
      }
    );
  }

  reply(oldMsg,replyTo){
    console.log("before",this.isReplySelected);
    this.isReplySelected = true;
    console.log("after",this.isReplySelected);
    console.log("oldMsg",oldMsg);
    console.log("replyTO" ,replyTo);
    this.msgData.message = oldMsg;
    this.msgData.reply_to = replyTo;
  }

  replyImg(oldImg,replyTo){
    this.isImgReplySelected = true;
    this.msgData.message = oldImg;
    this.msgData.reply_to = replyTo;
  }

}
function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
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

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}