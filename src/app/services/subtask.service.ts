import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Subtask } from '../interfaces/subtask.interface';

@Injectable({
  providedIn: 'root',
})

export class SubtaskService {
  private baseUrl = environment.baseUrl + '/subtasks';
  private subtasksSubject = new BehaviorSubject<Subtask[]>([]);
  public subtasks$ = this.subtasksSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadSubtasks();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getSubtasks(): Observable<Subtask[]> {
    return this.subtasks$;
  }

  private loadSubtasks(): void {
    this.httpClient.get<Subtask[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (subtasks) => this.subtasksSubject.next(subtasks),
      error: () => this.subtasksSubject.next([])
    });
  }

  getSubtaskById(id: number): Observable<Subtask> {
    return this.httpClient.get<Subtask>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createSubtask(subTask: Subtask): Observable<Subtask> {
    return new Observable(observer => {
      this.httpClient.post<Subtask>(this.baseUrl, subTask, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadSubtasks();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  updateSubtask(id: number, subTask: Subtask): Observable<Subtask> {
    return new Observable(observer => {
      this.httpClient.put<Subtask>(this.baseUrl + '/' + id, subTask, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadSubtasks();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  deleteSubtaskById(id: number): Observable<Subtask> {
    return new Observable(observer => {
      this.httpClient.delete<Subtask>(this.baseUrl + '/' + id, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadSubtasks();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
