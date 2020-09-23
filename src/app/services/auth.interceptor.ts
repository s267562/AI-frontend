import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {EMPTY, observable, Observable, of, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    refreshing = false

    constructor(private authService: AuthService, private router: Router) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        
        this.refreshToken() // check if token need to be refreshed

        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            const cloned = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
            })

            return next.handle(cloned).pipe(
                catchError( (error: HttpErrorResponse) => {
                    if(error.status === 401){
                        console.dir("token expired - login redirect")
                        this.router.navigate(['/login'])
                        return of(null);
                    } else 
                        return throwError(error)
                }))

        } else {
            // console.log('AuthInterceptor accessToken not found'); // (sing-in)
            return next.handle(request)
        }
    }

    refreshToken() {
        let expiresAt = parseInt(localStorage.getItem('expires_at')) * 1000
        const diff = expiresAt - new Date().getTime()

        if(diff > 0 && diff < 1800000 && !this.refreshing) {
            //console.dir(expiresAt - new Date().getTime())
            this.refreshing = true
            this.authService.refreshToken().subscribe(
                succ => {
                    console.dir("refresh - success")
                    this.refreshing = false
                }, 
                err => {
                    /* never reached */
                    console.dir("refresh - error")
                    this.router.navigate(['/login'])
                }
            )
        }
    }


}
