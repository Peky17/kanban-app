import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserTaskService {
  private baseUrl = environment.baseUrl + '/user-tasks';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Obtiene los usuarios asociados a una tarea específica
   */
  getUsersByTaskId(taskId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(
      this.baseUrl + '/users/' + taskId,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
