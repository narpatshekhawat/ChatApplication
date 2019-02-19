import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ServerService } from './server.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private http: HttpClient,
              private serverService : ServerService,
              private route : Router) { }

  getChatByRoom(room) {
    return this.http.get('http://localhost:3000/chat/' + room); 
  }

  saveChat(data) {
    return this.http.post('http://localhost:3000/chat', data);   
  }

  saveImgChat(data) {
    return this.http.post('http://localhost:3000/chat/image', data);   
  }

  saveLike(data){
    return this.http.put('http://localhost:3000/chat/likes',data);
  }

  logout(){
    this.serverService.deleteToken();
    this.route.navigateByUrl('');
  }
}
