import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Board } from '../interfaces/board.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private baseUrl = environment.baseUrl + '/boards';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getBoards(): Observable<Board[]> {
    return this.httpClient.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
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
    return this.httpClient.post<Board>(this.baseUrl, board, {
      headers: this.getAuthHeaders(),
    });
  }

  updateBoard(id: number, board: Board): Observable<Board> {
    return this.httpClient.put<Board>(this.baseUrl + '/' + id, board, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteBoardById(id: number): Observable<Board> {
    return this.httpClient.delete<Board>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}
