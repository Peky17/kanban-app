import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AccessGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    console.log(state.url);
    return this.validateUserRoleAccess(state.url);
  }
  canLoad(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.validateUserRoleAccess(state.url);
  }

  validateUserRoleAccess(state: string): Observable<boolean> | boolean {
    return this.authService.havePermission(state).pipe(
      tap((valid) => {
        console.log('recibido: ' + valid);
        if (!valid) {
          Swal.fire({
            title: 'Denied Operation',
            text: 'You do not have access for this module',
            icon: 'warning',
            confirmButtonText: 'Ok',
          }).then((action) => {
            this.router.navigateByUrl('/dashboard/home');
          });
        }
      })
    );
  }
}
