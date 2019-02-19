import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmEqualValidatorDirective } from './shared/confirm-equal-validator.directive';
import { AuthInterceptor } from './auth/auth.intercepter';
import { AuthGuard } from './auth/auth.guard';
import { ServerService } from './server.service';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms'
import { ChatService } from './chat.service';
import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  declarations: [
    ConfirmEqualValidatorDirective,
    AppComponent,
    SignupComponent,
    LoginComponent,
    ChatComponent,
    FileSelectDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{
    provide : HTTP_INTERCEPTORS,
    useClass : AuthInterceptor,
    multi : true
  },ServerService, ChatService , AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
