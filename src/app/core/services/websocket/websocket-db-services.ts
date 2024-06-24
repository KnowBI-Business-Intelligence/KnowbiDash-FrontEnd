import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketDBService {
  private _dataMode: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly dataModel = this._dataMode.asObservable();

  streamURL: string = 'http://localhost:8080/ws';
  client: any;
  private isConnected: boolean = false;

  constructor() {}

  streamData() {
    let ws = new SockJS(this.streamURL);
    this.client = Stomp.over(ws);
    let that = this;
    this.client.connect(
      {},
      function (frame: any) {
        that.isConnected = true;
        console.log('Conectado ao WebSocket');

        that.client.subscribe('/topic/database', (message: any) => {
          if (message.body) {
            that._dataMode.next(message.body);
          }
        });
      },
      function (error: any) {
        console.error('Erro ao conectar ao WebSocket:', error);
        that.isConnected = false;
      }
    );

    ws.onclose = function () {
      console.log('Conexão WebSocket fechada');
      that.isConnected = false;
    };
  }

  isConnectedToWebSocket(): boolean {
    return this.isConnected;
  }
}
