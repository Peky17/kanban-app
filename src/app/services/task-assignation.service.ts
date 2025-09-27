import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskAssignation } from '../interfaces/taskAssignation';
import { UserSubtaskAssign } from '../interfaces/userSubtaskAssign.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskAssignationService {
  private baseUrl = environment.baseUrl + '/user-tasks';
  private subtaskAssignUrl = environment.baseUrl + '/user-subtasks';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllAssignations(): Observable<TaskAssignation[]> {
    return this.httpClient.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getAssignationById(id: number): Observable<TaskAssignation> {
    return this.httpClient.get<TaskAssignation>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  getTaskAssignationByUserId(id: number): Observable<TaskAssignation[]> {
    return this.httpClient.get<TaskAssignation[]>(
      this.baseUrl + '/getAssociationsByUserId/' + id,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getAssignationsByTaskId(taskId: number): Observable<TaskAssignation[]> {
    return this.httpClient.get<TaskAssignation[]>(
      this.baseUrl + '/users/' + taskId,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getAssignationsByUserId(userId: number): Observable<TaskAssignation[]> {
    return this.httpClient.get<TaskAssignation[]>(
      this.baseUrl + '/tasks/' + userId,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  createAssignation(
    projectAssignation: TaskAssignation
  ): Observable<TaskAssignation> {
    return this.httpClient.post<TaskAssignation>(
      this.baseUrl,
      projectAssignation,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  updateAssignation(
    id: number,
    taskAssignation: TaskAssignation
  ): Observable<TaskAssignation> {
    return this.httpClient.put<TaskAssignation>(
      this.baseUrl + '/' + id,
      taskAssignation,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  deleteAssignationById(id: number): Observable<TaskAssignation> {
    return this.httpClient.delete<TaskAssignation>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Asigna subtareas a usuarios llamando a /api/user-subtasks/assign
   */
  assignUserSubtasks(assignments: UserSubtaskAssign[]): Observable<any> {
    return this.httpClient.post<any>(
      this.subtaskAssignUrl + '/assign',
      assignments,
      { headers: this.getAuthHeaders() }
    );
  }
}
