import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  API_ECXECUTE_SQL,
  API_ORACLE_DATABASE,
} from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseConnectionService {
  constructor(private http: HttpClient) {}

  private SERVICE_DB = API_ORACLE_DATABASE;
  private SERVICE_EXECUTE = API_ECXECUTE_SQL;

  connection(url: string, username: string, password: string) {
    const body = {
      url,
      username,
      password,
    };

    return this.http.post(this.SERVICE_DB, body);
  }

  executeSQL(code: string) {
    return this.http.post(this.SERVICE_EXECUTE, code, { responseType: 'text' });
  }
}
