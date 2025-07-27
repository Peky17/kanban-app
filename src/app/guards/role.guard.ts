import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.validateUserRole();
  }
  canLoad(): Observable<boolean> | boolean {
    return this.validateUserRole();
  }

  validateUserRole(): Observable<boolean> | boolean {
    return this.authService.validateUserRole().pipe(
      tap((valid) => {
        if (!valid) {
          this.router.navigateByUrl('/dashboard/home');
        }
      })
    );
  }
}
