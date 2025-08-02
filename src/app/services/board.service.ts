import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Board } from '../interfaces/board.interface';

@Injectable({
  providedIn: 'root',
})

export class BoardService {
  private baseUrl = environment.baseUrl + '/boards';
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  public boards$ = this.boardsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadBoards();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getBoards(): Observable<Board[]> {
    return this.boards$;
  }

  private loadBoards(): void {
    this.httpClient.get<Board[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (boards) => this.boardsSubject.next(boards),
      error: () => this.boardsSubject.next([])
    });
  }

  getBoardById(id: number): Observable<Board> {
    return this.httpClient.get<Board>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  getBoardsByProjectId(id: number): Observable<Board[]> {
    return this.httpClient.get<Board[]>(
      this.baseUrl + '/project-boards/' + id,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  createBoard(board: Board): Observable<Board> {
    return new Observable(observer => {
      this.httpClient.post<Board>(this.baseUrl, board, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBoards();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  updateBoard(id: number, board: Board): Observable<Board> {
    return new Observable(observer => {
      this.httpClient.put<Board>(this.baseUrl + '/' + id, board, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBoards();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
  deleteBoardById(id: number): Observable<Board> {
    return new Observable(observer => {
      this.httpClient.delete<Board>(this.baseUrl + '/' + id, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBoards();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // Versión duplicada eliminada, solo queda la versión reactiva
}
