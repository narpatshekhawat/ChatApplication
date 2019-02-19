import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Router } from '@angular/router'
import { ServerService } from '../server.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private serverService: ServerService,
        private route: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.headers.get('noauth'))
            return next.handle(req.clone());
        else {
            const clonedreq = req.clone({
                headers : req.headers.set("Authorization","Bearer " + this.serverService.getToken())
            });
            return next.handle(clonedreq).pipe(
                tap(
                    event => {},
                    err => {
                        if(err.error.auth == false){
                            this.route.navigateByUrl("/");
                        }
                    }
                )
            );
        }
    }
}
