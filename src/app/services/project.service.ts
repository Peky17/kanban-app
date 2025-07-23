import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../interfaces/project.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = environment.baseUrl + '/projects';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getProjectById(id: number): Observable<Project> {
    return this.httpClient.get<Project>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.baseUrl, project, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.httpClient.put<Project>(this.baseUrl + '/' + id, project, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProjectById(id: string): Observable<Project> {
    return this.httpClient.delete<Project>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}
