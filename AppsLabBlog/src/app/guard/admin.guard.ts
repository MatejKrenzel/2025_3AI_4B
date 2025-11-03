import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../components/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
  
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
    

    const isAdmin = await this.authService.isAdmin(user.uid);
    
    if (isAdmin) {
      return true;
    }
    

    this.router.navigate(['/dashboard']);
    alert('You do not have admin privileges to access this page.');
    return false;
  }
}