import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  saveUser(user: any) {
    return this.http.post('http://localhost:3000/users/register', user, this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post('http://localhost:3000/users/authenticate', authCredentials, this.noAuthHeader);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = localStorage.getItem('token');
    if (token) {
      var userPayLoad = atob(token.split('.')[1]);
      return JSON.parse(userPayLoad);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayLoad = this.getUserPayload();
    if (userPayLoad) {
      return userPayLoad.exp > Date.now() / 1000;
    }
    else {
      return false;
    }
  }

  loginStatus() {
    if (this.getToken() == null) {
      return false;
    }
    return true;
  }
}
