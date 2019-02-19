import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  showSuccessMessage : boolean;
  serverError : string;
  genders = ['Male','Female'];
  signupForm = new FormGroup({
    'fname' : new FormControl('',[Validators.required]),
    'mname' : new FormControl(''),
    'lname' : new FormControl('',[Validators.required]),
    'gender' : new FormControl('Male'),
    'username' : new FormControl('',[Validators.required,Validators.minLength(5)]),
    'email' : new FormControl('',[Validators.required,Validators.email]),
    'password' : new FormControl('',[Validators.required,Validators.minLength(5)]),
    'confirmPassword' : new FormControl('',Validators.required),
  });

  constructor(private serverService : ServerService,
    private route : Router) { }

  ngOnInit() {
  }

  onSubmit(){
    
    let user = this.signupForm.value; 
    console.log("user data : " ,user);
    if(this.signupForm.value.mname == '')
    {
      user.name = this.signupForm.value.fname + ' ' + this.signupForm.value.lname;
    }
    else
    {
      user.name = this.signupForm.value.fname + ' ' + this.signupForm.value.mname + ' ' + this.signupForm.value.lname;
    }
    this.serverService.saveUser(user).subscribe(
        res => { 
          this.showSuccessMessage = true;
          setTimeout(() => { this.showSuccessMessage = false; this.route.navigateByUrl("/") } , 4000);
          this.signupForm.reset('');
          this.serverError='';
        },
        err => {
          if(err.status == 422){
            this.serverError = err.error.join('<br />');
          }
        }
      );
  }

}
