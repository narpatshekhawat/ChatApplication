import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userNotFound = false;
  serverError = '';
  loginForm = new FormGroup(
    {
      email : new FormControl('',[Validators.required,Validators.email]),
      password : new FormControl('',[Validators.required,Validators.minLength(5)])
    }
  );

  constructor(private serverService : ServerService,
              private route : Router) { }

  ngOnInit() {
  }

  onSubmit(){

    this.serverService.login(this.loginForm.value).subscribe(
      result => {
        this.serverService.setToken(result['token']);
        this.route.navigate(['/chat']);
      },
      err => {
        this.serverError = err.error.message;
      }
    );
  }

}
