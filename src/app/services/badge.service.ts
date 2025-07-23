import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Badge } from '../interfaces/badge.interface';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private baseUrl = environment.baseUrl + '/labels';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getBadges(): Observable<Badge[]> {
    return this.httpClient.get<Badge[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getBadgeById(id: number): Observable<Badge> {
    return this.httpClient.get<Badge>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createBadge(badge: Badge): Observable<Badge> {
    return this.httpClient.post<Badge>(this.baseUrl, badge, {
      headers: this.getAuthHeaders(),
    });
  }

  updateBadge(id: number, badge: Badge): Observable<Badge> {
    return this.httpClient.put<Badge>(this.baseUrl + '/' + id, badge, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteBadgeById(id: number): Observable<Badge> {
    return this.httpClient.delete<Badge>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}
