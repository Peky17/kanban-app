import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  private baseUrl = environment.baseUrl + '/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadTasks();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  private loadTasks(): void {
    this.httpClient.get<Task[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (tasks) => this.tasksSubject.next(tasks),
      error: () => this.tasksSubject.next([])
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
    return new Observable(observer => {
      this.httpClient.post<Task>(this.baseUrl, task, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadTasks();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return new Observable(observer => {
      this.httpClient.put<Task>(this.baseUrl + '/' + id, task, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadTasks();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
  deleteTaskById(id: number): Observable<Task> {
    return new Observable(observer => {
      this.httpClient.delete<Task>(this.baseUrl + '/' + id, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadTasks();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // Versión duplicada eliminada, solo queda la versión reactiva
}
