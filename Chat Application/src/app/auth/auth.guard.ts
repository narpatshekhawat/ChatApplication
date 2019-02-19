import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerService } from '../server.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private serverService : ServerService,
              private route : Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(!this.serverService.isLoggedIn()){
        alert('You Need To Login First For Continue');
        this.route.navigateByUrl('/');
        this.serverService.deleteToken();
        return false;
      }
    return true;
  }
}
