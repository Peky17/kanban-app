import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ChatbotRequest,
  ChatbotResponse,
} from '../interfaces/chatbot.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private baseUrl = environment.baseUrl + '/chatbot';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProjectById(chatbotRequest: ChatbotRequest): Observable<ChatbotResponse> {
    return this.httpClient.post<ChatbotResponse>(
      this.baseUrl + '/ask',
      chatbotRequest,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
