import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PROFILES } from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private ENV_PROFILES = API_PROFILES;

  constructor(private http: HttpClient) {}

  getProfiles(headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.ENV_PROFILES}/get`, { headers: headers });
  }

  createProfiles(
    headers: HttpHeaders,
    name: string,
    observation: string,
    chartPath: {} = {}
  ): Observable<any> {
    const body = {
      name,
      observation,
      chartPath,
    };

    return this.http.post(`${this.ENV_PROFILES}/create`, body, {
      headers: headers,
    });
  }

  updateProfiles(headers: HttpHeaders, id: string, data: {}): Observable<any> {
    return this.http.patch(`${this.ENV_PROFILES}/update/${id}`, data, {
      headers: headers,
    });
  }

  deleteProfiles(headers: HttpHeaders, id: string): Observable<any> {
    return this.http.delete(`${this.ENV_PROFILES}/delete/${id}`, {
      headers: headers,
    });
  }
}
