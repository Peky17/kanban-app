import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectAssignation } from '../interfaces/projectAssignation.interface';
import { Project } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectAssignationService {
  private baseUrl = environment.baseUrl + '/project-users';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllAssignations(): Observable<ProjectAssignation[]> {
    return this.httpClient.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getAssignationById(id: number): Observable<ProjectAssignation> {
    return this.httpClient.get<ProjectAssignation>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  getAssignationsByProjectId(
    projectId: number
  ): Observable<ProjectAssignation[]> {
    return this.httpClient.get<ProjectAssignation[]>(
      this.baseUrl + '/users/' + projectId,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getAssignationsByUserId(userId: number): Observable<Project[]> {
    return this.httpClient.get<Project[]>(
      this.baseUrl + '/projects/' + userId,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  createAssignation(
    projectAssignation: ProjectAssignation
  ): Observable<ProjectAssignation> {
    return this.httpClient.post<ProjectAssignation>(
      this.baseUrl,
      projectAssignation,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  updateAssignation(
    id: number,
    projectAssignation: ProjectAssignation
  ): Observable<ProjectAssignation> {
    return this.httpClient.put<ProjectAssignation>(
      this.baseUrl + '/' + id,
      projectAssignation,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  deleteAssignationById(id: number): Observable<ProjectAssignation> {
    return this.httpClient.delete<ProjectAssignation>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}
