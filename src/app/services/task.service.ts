import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = environment.baseUrl + '/tasks';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getTasksByBucket(id: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseUrl + '/tasks-bucket/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  getTaskById(id: number): Observable<Task> {
    return this.httpClient.get<Task>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(this.baseUrl, task, {
      headers: this.getAuthHeaders(),
    });
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.httpClient.put<Task>(this.baseUrl + '/' + id, task, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteTaskById(id: number): Observable<Task> {
    return this.httpClient.delete<Task>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}
