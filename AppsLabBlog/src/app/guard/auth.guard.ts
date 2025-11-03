import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../components/services/auth.service';
import { AdminGuard} from "./admin.guard";

@Injectable({
  providedIn: 'root'
  
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.authService.getCurrentUser();
    
    if (user) {
    
      return true;
    }
    
 
    this.router.navigate(['/register'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}