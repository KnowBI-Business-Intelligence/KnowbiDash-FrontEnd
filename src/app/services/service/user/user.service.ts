import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEST_API, USERS_API } from '../../environments/environment';

const API_TEST = TEST_API;
const API_USERS = USERS_API;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsersInfo({ headers }: { headers: HttpHeaders }): Observable<any> {
    return this.http.get(API_USERS + '/get', { headers: headers });
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API_TEST + '/all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_TEST + '/user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_TEST + '/mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_TEST + '/admin', { responseType: 'text' });
  }
}
