import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PROFILES } from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private ENV_PROFILES = API_PROFILES;

  headers: any;

  constructor(private http: HttpClient) {}

  getProfiles(headers: HttpHeaders): Observable<any> {
    const headersRgister = {
      headers: headers,
    };

    return this.http.get(`${this.ENV_PROFILES}/get`, headersRgister);
  }

  createProfiles(
    headers: HttpHeaders,
    name: string,
    observation: string,
    chartPath: {} = {}
  ): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    const body = {
      name,
      observation,
      chartPath,
    };

    return this.http.post(`${this.ENV_PROFILES}/create`, body, myHeaders);
  }

  updateProfiles(headers: HttpHeaders): Observable<any> {
    const headersRgister = {
      headers: headers,
    };
    return this.http.get(`${this.ENV_PROFILES}/get`, headersRgister);
  }

  deleteProfiles(headers: HttpHeaders): Observable<any> {
    const headersRgister = {
      headers: headers,
    };
    return this.http.get(`${this.ENV_PROFILES}/get`, headersRgister);
  }
}
