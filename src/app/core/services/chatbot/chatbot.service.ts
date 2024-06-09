import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly WEBSOCKET_URL = 'ws://localhost:8000/koios/ws';
  private socket!: WebSocket;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket(this.WEBSOCKET_URL);

    this.socket.onopen = (event) => {
      console.log('WebSocket is open now.', event);
    };

    this.socket.onmessage = (event) => {
      console.log('WebSocket message received:', event);
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket is closed now.', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error observed:', error);
    };
  }

  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error(
        'WebSocket is not open. Ready state is:',
        this.socket.readyState
      );
    }
  }

  receiveMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
