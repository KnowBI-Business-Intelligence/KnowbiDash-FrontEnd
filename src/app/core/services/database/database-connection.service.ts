import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import {
  API_DATABASES,
  API_ECXECUTE_SQL,
  API_ORACLE_DATABASE,
} from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseConnectionService {
  private connectionSuccessfulSubject = new Subject<void>();
  private disconnectionSuccessfulSubject = new Subject<void>();

  connectionSuccessful$ = this.connectionSuccessfulSubject.asObservable();
  disconnectionSuccessful$ = this.disconnectionSuccessfulSubject.asObservable();
  constructor(private http: HttpClient) {}

  private SERVICE_DB = API_ORACLE_DATABASE;
  private SERVICE_EXECUTE = API_ECXECUTE_SQL;
  private SERVICE_DATABASES = API_DATABASES;

  notifyConnectionSuccessful() {
    this.connectionSuccessfulSubject.next();
  }

  notifyDisconnectionSuccessful() {
    this.disconnectionSuccessfulSubject.next();
  }

  connection(headers: HttpHeaders, DatabasesData: any) {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(
      `${this.SERVICE_DB}/connect`,
      DatabasesData,
      myHeaders
    );
  }

  desconnection(headers: HttpHeaders) {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(`${this.SERVICE_DB}/disconnect`, {}, myHeaders);
  }

  desconnectionAll(headers: HttpHeaders) {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(`${this.SERVICE_DB}/disconnect-all`, {}, myHeaders);
  }

  getConnection(headers: HttpHeaders) {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.SERVICE_DB}/connection-info`, myHeaders);
  }

  executeSQL(code: string) {
    return this.http.post(this.SERVICE_EXECUTE, code, { responseType: 'text' });
  }

  getDataBases(headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.SERVICE_DATABASES}/get`, myHeaders);
  }

  getDataBasesById(id: number, headers: any): Observable<any> {
    return this.http.get(`${this.SERVICE_DATABASES}/get/${id}`, {
      headers: headers,
    });
  }

  createDataBases(headers: HttpHeaders, DataBasesData: any): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(
      `${this.SERVICE_DATABASES}/create`,
      DataBasesData,
      myHeaders
    );
  }

  updateDataBases(headers: HttpHeaders, DataBasesData: any, id: any) {
    const options = {
      headers: headers,
    };

    return this.http.patch(
      `${this.SERVICE_DATABASES}/update/${id}`,
      DataBasesData,
      options
    );
  }

  deleteDataBases(headers: HttpHeaders, id: string): Observable<any> {
    const myHeaders = {
      headers: headers,
    };
    return this.http.delete(
      `${this.SERVICE_DATABASES}/delete/${id}`,
      myHeaders
    );
  }
}
