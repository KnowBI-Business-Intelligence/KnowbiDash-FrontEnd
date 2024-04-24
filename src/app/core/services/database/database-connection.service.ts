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

  connection(
    url: string,
    username: string,
    password: string
  ): Observable<string> {
    const body = {
      url,
      username,
      password,
    };

    return this.http
      .post(this.SERVICE_DB, body, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocorreu um erro:', error.error.message);
    } else {
      console.error(
        `Erro no servidor ${error.status}, ` + `detalhes: ${error.error}`
      );
    }
    return throwError(() => {
      return new Error(
        'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.'
      );
    });
  }

  executeSQL(code: string) {
    return this.http
      .post(this.SERVICE_EXECUTE, code, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }
}
