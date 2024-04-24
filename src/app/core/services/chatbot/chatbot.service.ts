import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CHAT } from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  constructor(private http: HttpClient) {}

  private SERVICE_BOT = API_CHAT;

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:333',
    });

    const body = { message: message };

    return this.http.post(this.SERVICE_BOT, body, { headers: headers });
  }
}
