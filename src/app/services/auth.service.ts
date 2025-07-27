import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from './../interfaces/user.interface';
import Swal from 'sweetalert2';
import { AccessRole } from '../dashboard/shared/utils/access-role';
import { MenuItem } from '../interfaces/menuItem.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private accessRole: AccessRole) {}

  private baseUrl = environment.baseUrl;

  private _user: any = {};

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  get user() {
    return this._user;
  }

  login(data: any) {
    return this.httpClient.post<any>(this.baseUrl + '/auth/login', data).pipe(
      map((res) => {
        // Validate if the response contains a token
        if (res.token) {
          return res;
        }

        return 'Error al iniciar sesión';
      }),
      catchError((err) => {
        return of(err.error.message);
      })
    );
  }

  getUserRole(): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + '/auth/me', {
      headers: this.getAuthHeaders(),
    });
  }

  // Validate if the token is in the local storage
  validarToken(): Observable<boolean> {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };

      return this.httpClient
        .get<any>(this.baseUrl + '/auth/me', { headers })
        .pipe(
          map((res) => {
            let localStorageUser = localStorage
              .getItem('email')
              ?.replace(/['"]/g, '');
            let usernameObtained = res.username;
            if (localStorageUser === usernameObtained) return true;
            else return false;
          }),
          catchError((err) => {
            if (
              err.status === 400 ||
              err.status === 401 ||
              err.status === 403
            ) {
              Swal.fire({
                title: 'Sesión caducada',
                text: 'Por favor inicia sesión de nuevo',
                icon: 'warning',
                confirmButtonText: 'Ok',
              });
              this.logOutAlert();
              return of(false);
            }
            this.logOutAlert();
            return of(false);
          })
        );
    } else {
      this.logOutAlert();
      return of(false);
    }
  }

  // Validate the admin role user
  validateUserRole(): Observable<boolean> {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      return this.httpClient
        .get<any>(this.baseUrl + '/auth/me', { headers })
        .pipe(
          map((res) => {
            let roleName = res.role.name;
            if (
              roleName == 'Administrator' ||
              roleName == 'Manager' ||
              roleName == 'Associate'
            )
              return true;
            else return false;
          }),
          catchError((err) => {
            if (
              err.status === 400 ||
              err.status === 401 ||
              err.status === 403
            ) {
              Swal.fire({
                title: 'Access Denied',
                text: 'You do not have access in this module',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              this.logOutAlert();
              return of(false);
            }
            this.logOutAlert();
            return of(false);
          })
        );
    } else {
      this.logOutAlert();
      return of(false);
    }
  }

  havePermission(path: string): Observable<boolean> {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      return this.httpClient
        .get<any>(this.baseUrl + '/auth/me', { headers })
        .pipe(
          map((user: User) => {
            let accessItems: MenuItem[] = this.accessRole.getAccessItems();
            let currentRole: string = user.role.name;
            let itemFound = accessItems.find(
              (item) => item.redirection == path
            );
            let canAccess = false;
            itemFound!.roleAccess.forEach((role: string) => {
              if (role === currentRole) canAccess = true;
              console.log(role);
            });
            return canAccess;
          }),
          catchError((err) => {
            if (
              err.status === 400 ||
              err.status === 401 ||
              err.status === 403
            ) {
              Swal.fire({
                title: 'Access Denied',
                text: 'You do not have access in this module',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              this.logOutAlert();
              return of(false);
            }
            this.logOutAlert();
            return of(false);
          })
        );
    } else {
      this.logOutAlert();
      return of(false);
    }
  }

  logOutAlert() {
    Swal.fire({
      title: 'Sesión caducada',
      text: 'Por favor inicia sesión de nuevo',
      icon: 'warning',
      confirmButtonText: 'Ok',
    });
  }
}
