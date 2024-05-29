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
  API_WORKSPACE,
} from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  private ENV_CHARTS = API_CHARTS;
  private ENV_CARDS = API_CARDS;
  private ENV_TABLES = API_TABLES;
  private ENV_WORKSPACE = API_WORKSPACE;
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

    return this.http.get(`${this.ENV_TABLES}/get`, myHeaders);
  }

  getWorkspace(headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${this.ENV_WORKSPACE}/get`, myHeaders);
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

  getChartsTableData(id: number, headers: any): Observable<any> {
    return this.http.get(`${API_CHARTGROUP}/tabledata/${id}`, {
      headers: headers,
    });
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

  createWorkspace(headers: HttpHeaders, wsData: any): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(`${this.ENV_WORKSPACE}/create`, wsData, myHeaders);
  }

  createChartsPath(pathData: any, headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(`${this.ENV_CHARTPATH}/create`, pathData, myHeaders);
  }

  createChartGroup(groupData: any, headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(
      `${this.ENV_CHARTGROUP}/create`,
      groupData,
      myHeaders
    );
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

  updateCards(headers: HttpHeaders, cardData: any, id: any) {
    const options = {
      headers: headers,
    };

    return this.http.patch(`${this.ENV_CARDS}/update/${id}`, cardData, options);
  }

  updateTables(headers: HttpHeaders, tableData: any, id: any) {
    const options = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_TABLES}/update/${id}`,
      tableData,
      options
    );
  }

  updateWorkspace(headers: HttpHeaders, wsData: any, id: any) {
    const options = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_WORKSPACE}/update/${id}`,
      wsData,
      options
    );
  }

  updateChartGroup(headers: HttpHeaders, chartGroupData: any, id: any) {
    const options = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_CHARTGROUP}/update/${id}`,
      chartGroupData,
      options
    );
  }

  updateChartGroupSQL(
    headers: HttpHeaders,
    sql: number,
    ID_chartPath: number
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
    requestBody: any,
    id: string
  ): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.patch(
      `${this.ENV_CHARTPATH}/update/${id}`,
      requestBody,
      myHeaders
    );
  }

  // DELETE

  deleteChartsPath(headers: HttpHeaders, id: string): Observable<any> {
    const myHeaders = {
      headers: headers,
    };
    return this.http.delete(`${this.ENV_CHARTPATH}/delete/${id}`, myHeaders);
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
