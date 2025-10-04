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
  /**
   * Obtiene los buckets del usuario
   */
  getBucketsByUserId(userId: number): Observable<any[]> {
    const url = `${environment.baseUrl}/buckets/user/${userId}`;
    return this.httpClient.get<any[]>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * Crea una tarea personal
   */
  createPersonalTask(task: any): Observable<any> {
    const url = `${environment.baseUrl}/personal-tasks`;
    return this.httpClient.post<any>(url, task, { headers: this.getAuthHeaders() });
  }
  /**
   * Obtiene todas las subtasks asignadas a un usuario
   * @param userId ID del usuario
   */
  getUserSubtasksByUserId(userId: number) {
    const url = `${this.subtaskAssignUrl}/user/${userId}`;
    return this.httpClient.get<any[]>(url, { headers: this.getAuthHeaders() });
  }
  /**
   * Obtiene la asignación de subtask para un usuario por id de subtask
   * @param subtaskId ID de la subtask
   */
  getUserSubtaskBySubtaskId(subtaskId: number): Observable<UserSubtaskAssign> {
    const url = `${this.subtaskAssignUrl}/subtask/${subtaskId}`;
    return this.httpClient.get<UserSubtaskAssign>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * Obtiene las subtasks asignadas a un usuario para una tarea específica
   * @param userId ID del usuario
   * @param taskId ID de la tarea
   */
  getUserSubtasksByTask(userId: number, taskId: number): Observable<UserSubtaskAssign[]> {
    const url = `${this.subtaskAssignUrl}/by-user-task?userId=${userId}&taskId=${taskId}`;
    return this.httpClient.get<UserSubtaskAssign[]>(url, { headers: this.getAuthHeaders() });
  }
  private baseUrl = environment.baseUrl + '/user-tasks';
  private subtaskAssignUrl = environment.baseUrl + '/user-subtasks';

    /**
     * Actualiza el estado de completado de una subtask asignada
     * @param id ID de la asignación de la subtask (user-subtask)
     * @param completed Estado a actualizar (true/false)
     */
    updateUserSubtaskStatus(id: number, completed: boolean): Observable<any> {
      const url = `${this.subtaskAssignUrl}/${id}/status?completed=${completed}`;
      return this.httpClient.put<any>(url, null, { headers: this.getAuthHeaders() });
    }

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
   * Asigna subtareas a usuarios llamando a /api/user-subtasks/assign?userId=...&subtaskId=...
   * Devuelve un array de observables para cada asignación
   */
  assignUserSubtasks(assignments: UserSubtaskAssign[]): Observable<any>[] {
    return assignments.map(a => {
      const url = `${this.subtaskAssignUrl}/assign?userId=${a.userId}&subtaskId=${a.subtaskId}`;
      return this.httpClient.post<any>(url, null, { headers: this.getAuthHeaders() });
    });
  }
}
