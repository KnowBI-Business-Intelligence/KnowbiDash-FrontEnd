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

  createProfiles(requestBody: any, headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.post(
      `${this.ENV_PROFILES}/create`,
      requestBody,
      myHeaders
    );
  }

  updateProfiles(
    id: any,
    requestBody: any,
    headers: HttpHeaders
  ): Observable<any> {
    const headersRgister = {
      headers: headers,
    };
    return this.http.patch(
      `${this.ENV_PROFILES}/update/${id}`,
      requestBody,
      headersRgister
    );
  }

  deleteProfiles(headers: HttpHeaders, profileID: string): Observable<any> {
    const headersRgister = {
      headers: headers,
    };
    return this.http.delete(
      `${this.ENV_PROFILES}/delete/${profileID}`,
      headersRgister
    );
  }
}
