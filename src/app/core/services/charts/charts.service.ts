import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  API_CHARTGROUP,
  API_CHARTPATH,
  API_CHARTS,
} from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  private ENV_CHARTS = API_CHARTS;
  private ENV_CHARTPATH = API_CHARTPATH;
  private ENV_CHARTGROUP = API_CHARTGROUP;

  // MANTER HEADERS SEMPRE COMO PRIMEIRO PARAMS

  constructor(private http: HttpClient) {}

  // GETS

  getCharts(headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.ENV_CHARTS}/get`, { headers: headers });
  }

  getChartsPath(headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.ENV_CHARTPATH}/get`, { headers: headers });
  }

  getChartsPathById(headers: HttpHeaders, id: number): Observable<any> {
    return this.http.get(`${API_CHARTPATH}/get/${id}`, { headers: headers });
  }

  getChartGroup(headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.ENV_CHARTGROUP}/get`, { headers: headers });
  }

  getChartsGroupById(id: number, headers: any): Observable<any> {
    return this.http.get(`${API_CHARTGROUP}/get/${id}`, { headers: headers });
  }

  // CREATES

  createCharts(headers: HttpHeaders, chartData: any): Observable<any> {
    return this.http.post(`${this.ENV_CHARTS}/create`, chartData, {
      headers: headers,
    });
  }

  createChartsPath(
    headers: HttpHeaders,
    name: string,
    profile: string
  ): Observable<any> {
    console.log(profile);

    const body = {
      name,
    };

    return this.http.post(`${this.ENV_CHARTPATH}/create`, body, {
      headers: headers,
    });
  }

  createChartGroup(
    headers: any,
    name: string,
    pgTableName: string,
    ID_chartPath: string
  ) {
    let headerObj: { [header: string]: string } = {};

    if (headers instanceof HttpHeaders) {
      headers.keys().forEach((key) => {
        const value = headers.get(key);
        if (value !== null) {
          headerObj[key] = value;
        }
      });
    } else {
      headerObj = headers;
    }

    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...headerObj,
    });

    const chartPath = {
      id: ID_chartPath,
    };

    const body = { name, pgTableName, chartPath };

    return this.http
      .post(`${this.ENV_CHARTGROUP}/create`, body, {
        headers: myHeaders,
      })
      .pipe(catchError(this.handleError));
  }

  // UPDATES

  updateCharts(headers: HttpHeaders, chartData: any, id: any) {
    return this.http.patch(`${this.ENV_CHARTS}/update/${id}`, chartData, {
      headers: headers,
    });
  }

  updateChartGroupSQL(
    headers: HttpHeaders,
    ID_chartPath: string,
    sql: string
  ): Observable<any> {
    let headerObj: { [header: string]: string } = {};

    if (headers instanceof HttpHeaders) {
      headers.keys().forEach((key) => {
        const value = headers.get(key);
        if (value !== null) {
          headerObj[key] = value;
        }
      });
    } else {
      headerObj = headers;
    }

    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...headerObj,
    });

    const body = JSON.stringify({ sql });

    return this.http.patch(
      `${this.ENV_CHARTGROUP}/update/sql/${ID_chartPath}`,
      body,
      {
        headers: myHeaders,
        responseType: 'text',
      }
    );
  }

  updateChartsPath(
    headers: HttpHeaders,
    id: string,
    name: string
  ): Observable<any> {
    return this.http.patch(`${this.ENV_CHARTPATH}/update/${id}`, name, {
      headers: headers,
    });
  }

  updateChartGroup(
    headers: HttpHeaders,
    id: string,
    name: string,
    pgTableName: string,
    ID_chartPath: string
  ) {
    const chartPath = {
      id: ID_chartPath,
    };

    const body = {
      name,
      pgTableName,
      chartPath,
    };

    return this.http.patch(`${this.ENV_CHARTGROUP}/update/${id}`, body, {
      headers: headers,
    });
  }

  // DELETE

  deleteChartsPath(headers: HttpHeaders, id: string): Observable<any> {
    return this.http.delete(`${this.ENV_CHARTPATH}/delete${id}`, {
      headers: headers,
    });
  }

  deleteCharts(headers: HttpHeaders, id: string): Observable<any> {
    return this.http.delete(`${this.ENV_CHARTS}/delete/${id}`, {
      headers: headers,
    });
  }

  deleteChartGroup(headers: HttpHeaders, id: string) {
    return this.http.delete(`${this.ENV_CHARTGROUP}/delete/${id}`, {
      headers: headers,
    });
  }

  // ERROR

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar sua solicitação. ';

    if (error.error instanceof ErrorEvent) {
      errorMessage += `Erro: ${error.error.message}`;
    } else {
      errorMessage += `Erro no servidor ${error.status}`;
      if (error.error && typeof error.error === 'object') {
        errorMessage += ` - Detalhes: ${JSON.stringify(error.error)}`;
      }
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
