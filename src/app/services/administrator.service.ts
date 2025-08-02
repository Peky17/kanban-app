import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AdministratorService {
  private baseUrl = environment.baseUrl + '/users';
  private administratorsSubject = new BehaviorSubject<any[]>([]);
  public administrators$ = this.administratorsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadAdministrators();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }


  createAdministrator(data: any): Observable<any> {
    return new Observable(observer => {
      this.httpClient.post<any>(this.baseUrl, data, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadAdministrators();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }


  getAdministrators(): Observable<any[]> {
    return this.administrators$;
  }

  private loadAdministrators(): void {
    this.httpClient.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (admins) => this.administratorsSubject.next(admins),
      error: () => this.administratorsSubject.next([])
    });
  }

  getAdministratorById(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }


  updateAdministrator(id: string, data: any): Observable<any> {
    return new Observable(observer => {
      this.httpClient.put<any>(`${this.baseUrl}/${id}`, data, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadAdministrators();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  deleteAdministrator(id: string): Observable<any> {
    return new Observable(observer => {
      this.httpClient.delete<any>(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadAdministrators();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
