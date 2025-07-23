import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Subtask } from '../interfaces/subtask.interface';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private baseUrl = environment.baseUrl + '/subtasks';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getSubtasks(): Observable<Subtask[]> {
    return this.httpClient.get<Subtask[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getSubtaskById(id: number): Observable<Subtask> {
    return this.httpClient.get<Subtask>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createSubtask(subTask: Subtask): Observable<Subtask> {
    return this.httpClient.post<Subtask>(this.baseUrl, subTask, {
      headers: this.getAuthHeaders(),
    });
  }

  updateSubtask(id: number, subTask: Subtask): Observable<Subtask> {
    return this.httpClient.put<Subtask>(this.baseUrl + '/' + id, subTask, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteSubtaskById(id: number): Observable<Subtask> {
    return this.httpClient.delete<Subtask>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}
