import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../interfaces/project.interface';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProjectService {
  private baseUrl = environment.baseUrl + '/projects';
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadProjects();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  private loadProjects(): void {
    this.httpClient.get<Project[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (projects) => this.projectsSubject.next(projects),
      error: () => this.projectsSubject.next([])
    });
  }

  getProjectById(id: number): Observable<Project> {
    return this.httpClient.get<Project>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  createProject(project: Project): Observable<Project> {
    return new Observable(observer => {
      this.httpClient.post<Project>(this.baseUrl, project, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadProjects();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return new Observable(observer => {
      this.httpClient.put<Project>(this.baseUrl + '/' + id, project, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadProjects();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  deleteProjectById(id: string): Observable<Project> {
    return new Observable(observer => {
      this.httpClient.delete<Project>(this.baseUrl + '/' + id, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadProjects();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
