import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AUTH_API, USERS_API } from '../../../../env/environment';

const API_USER = USERS_API;
const API_AUTH = AUTH_API;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private USER_KEY = 'auth-user';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${API_AUTH}/signin`, {
        userName: username,
        passWord: password,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getUsersInfo(headers: HttpHeaders): Observable<any> {
    return this.http.get(`${API_USER}/get`, { headers });
  }

  getById(id: any, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${API_USER}/get/${id}`, { headers });
  }

  register(userData: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(`${API_USER}/create`, userData, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  edit(id: number, userData: any, headers: any): Observable<any> {
    return this.http
      .patch(`${API_USER}/update/${id}`, userData, { headers })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  delete(id_user: number, headers: any): Observable<any> {
    return this.http.delete(`${API_USER}/delete/${id_user}`, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${API_AUTH}/signout`, {});
  }

  refreshToken(token: string): Observable<any> {
    return this.http
      .post(`${API_AUTH}/refreshtoken`, { refreshToken: token })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  isAutenticaded(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const user = window.sessionStorage.getItem(this.USER_KEY);
        return !!user;
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
      }
    }
    return false;
  }
}
