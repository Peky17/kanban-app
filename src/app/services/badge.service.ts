import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Badge } from '../interfaces/badge.interface';

@Injectable({
  providedIn: 'root',
})

export class BadgeService {
  private baseUrl = environment.baseUrl + '/labels';
  private badgesSubject = new BehaviorSubject<Badge[]>([]);
  public badges$ = this.badgesSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadBadges();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getBadges(): Observable<Badge[]> {
    return this.badges$;
  }

  private loadBadges(): void {
    this.httpClient.get<Badge[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (badges) => this.badgesSubject.next(badges),
      error: () => this.badgesSubject.next([])
    });
  }

  getBadgeById(id: number): Observable<Badge> {
    return this.httpClient.get<Badge>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createBadge(badge: Badge): Observable<Badge> {
    return new Observable(observer => {
      this.httpClient.post<Badge>(this.baseUrl, badge, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBadges();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  updateBadge(id: number, badge: Badge): Observable<Badge> {
    return new Observable(observer => {
      this.httpClient.put<Badge>(this.baseUrl + '/' + id, badge, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBadges();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  deleteBadgeById(id: number): Observable<Badge> {
    return new Observable(observer => {
      this.httpClient.delete<Badge>(this.baseUrl + '/' + id, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBadges();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
