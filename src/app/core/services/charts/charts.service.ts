import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  API_CARDS,
  API_CHARTGROUP,
  API_CHARTPATH,
  API_CHARTS,
  API_TABLES,
} from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  private ENV_CHARTS = API_CHARTS;
  private ENV_CARDS = API_CARDS;
  private ENV_TABLES = API_TABLES;
  private ENV_CHARTPATH = API_CHARTPATH;
  private ENV_CHARTGROUP = API_CHARTGROUP;

  constructor(private http: HttpClient) {}

  // GETS

  getCharts(headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.ENV_CHARTS}/get`, myHeaders);
  }

  getCards(headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.ENV_CARDS}/get`, myHeaders);
  }

  getTables(headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.ENV_CARDS}/get`, myHeaders);
  }

  getChartsPath(headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.ENV_CHARTPATH}/get`, myHeaders);
  }

  getChartsPathById(id: number, headers: any): Observable<any> {
    return this.http.get(`${API_CHARTPATH}/get/${id}`, { headers: headers });
  }

  getChartGroup(headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.ENV_CHARTGROUP}/get`, myHeaders);
  }

  getChartsGroupById(id: number, headers: any): Observable<any> {
    return this.http.get(`${API_CHARTGROUP}/get/${id}`, { headers: headers });
  }

  // CREATES

  createCharts(headers: HttpHeaders, chartData: any): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(`${this.ENV_CHARTS}/create`, chartData, myHeaders);
  }

  createCards(headers: HttpHeaders, chartData: any): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(`${this.ENV_CARDS}/create`, chartData, myHeaders);
  }

  createTables(headers: HttpHeaders, chartData: any): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(`${this.ENV_TABLES}/create`, chartData, myHeaders);
  }

  createChartsPath(
    name: string,
    profile_id: {} = {},
    headers: HttpHeaders
  ): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    const body = {
      name,
      profile_id,
    };

    return this.http.post(`${this.ENV_CHARTPATH}/create`, body, myHeaders);
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
    const options = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_CHARTS}/update/${id}`,
      chartData,
      options
    );
  }

  updateCards(headers: HttpHeaders, chartData: any, id: any) {
    const options = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_CARDS}/update/${id}`,
      chartData,
      options
    );
  }

  updateTables(headers: HttpHeaders, chartData: any, id: any) {
    const options = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_TABLES}/update/${id}`,
      chartData,
      options
    );
  }

  updateChartGroupSQL(
    headers: HttpHeaders,
    sql: string,
    ID_chartPath: string
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
    const myHeaders = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_CHARTPATH}/update/${id}`,
      name,
      myHeaders
    );
  }

  updateChartGroup(
    id: string,
    name: string,
    pgTableName: string,
    ID_chartPath: string,
    headers: HttpHeaders
  ) {
    const myHeaders = {
      headers: headers,
    };

    const chartPath = {
      id: ID_chartPath,
    };

    const body = { name, pgTableName, chartPath };

    return this.http.patch(
      `${this.ENV_CHARTGROUP}/update/${id}`,
      body,
      myHeaders
    );
  }

  // DELETE

  deleteChartsPath(headers: HttpHeaders, id: string): Observable<any> {
    const myHeaders = {
      headers: headers,
    };
    return this.http.delete(`${this.ENV_CHARTPATH}/delete${id}`, myHeaders);
  }

  deleteCharts(headers: HttpHeaders, id: string): Observable<any> {
    const myHeaders = {
      headers: headers,
    };
    return this.http.delete(`${this.ENV_CHARTS}/delete/${id}`, myHeaders);
  }

  deleteCards(headers: HttpHeaders, id: string): Observable<any> {
    const myHeaders = {
      headers: headers,
    };
    return this.http.delete(`${this.ENV_CARDS}/delete/${id}`, myHeaders);
  }

  deleteTables(headers: HttpHeaders, id: string): Observable<any> {
    const myHeaders = {
      headers: headers,
    };
    return this.http.delete(`${this.ENV_TABLES}/delete/${id}`, myHeaders);
  }

  deleteChartGroup(headers: HttpHeaders, id: string) {
    const myHeaders = {
      headers: headers,
    };
    return this.http.delete(`${this.ENV_CHARTGROUP}/delete/${id}`, myHeaders);
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
