import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { PersonalTask } from '../interfaces/personalTask.interface';

@Injectable({
  providedIn: 'root',
})
export class PersonalTaskService {
  private baseUrl = environment.baseUrl + '/personal-tasks';
  private tasksSubject = new BehaviorSubject<PersonalTask[]>([]);
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

  getTasks(): Observable<PersonalTask[]> {
    return this.tasks$;
  }

  private loadTasks(): void {
    this.httpClient
      .get<PersonalTask[]>(this.baseUrl, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (tasks) => this.tasksSubject.next(tasks),
        error: () => this.tasksSubject.next([]),
      });
  }

  getTaskById(id: number): Observable<PersonalTask> {
    return this.httpClient.get<PersonalTask>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  getTaskByUserId(id: number): Observable<PersonalTask> {
    return this.httpClient.get<PersonalTask>(this.baseUrl + '/user/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createTask(task: PersonalTask): Observable<PersonalTask> {
    return new Observable((observer) => {
      this.httpClient
        .post<PersonalTask>(this.baseUrl, task, {
          headers: this.getAuthHeaders(),
        })
        .subscribe({
          next: (res) => {
            this.loadTasks();
            observer.next(res);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  updateTask(id: number, task: PersonalTask): Observable<PersonalTask> {
    return new Observable((observer) => {
      this.httpClient
        .put<PersonalTask>(this.baseUrl + '/' + id, task, {
          headers: this.getAuthHeaders(),
        })
        .subscribe({
          next: (res) => {
            this.loadTasks();
            observer.next(res);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  deleteTaskById(id: number): Observable<PersonalTask> {
    return new Observable((observer) => {
      this.httpClient
        .delete<PersonalTask>(this.baseUrl + '/' + id, {
          headers: this.getAuthHeaders(),
        })
        .subscribe({
          next: (res) => {
            this.loadTasks();
            observer.next(res);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }
}
