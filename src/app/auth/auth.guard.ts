import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    //console.dir("AuthGuard - canActivate() - checkLogin(" + url + ") --> " + this.checkLogin(url));

    if (this.authService.isLoggedIn()) { return true; }
    
    console.dir("AuthGuard - url = " + url);
    if(url !== "/home") {
      // Navigate to the login page with extras
      this.router.navigate(['/login'], { queryParams: { redirect_to: url } });
    } else {
      // Navigate to the login page without extras
      this.router.navigate(['/login']);
    }
    
    return false;
  }

}
