import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AUTH_API, USERS_API } from '../../../../env/environment';

const API_USER = USERS_API;
const API_AUTH = AUTH_API;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private USER_KEY = 'auth-user';
  constructor(private http: HttpClient) {}

  loginUser(username: string, password: string): Observable<any> {
    const credentials = this.http
      .post(`${API_AUTH}/signin`, {
        userName: username,
        passWord: password,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );

    return credentials;
  }

  getUsersInfo(headers: HttpHeaders): Observable<any> {
    return this.http.get(`${API_USER}/get`, { headers: headers });
  }

  getUserById(headers: HttpHeaders, id: any): Observable<any> {
    return this.http.get(`${API_USER}/get/${id}`, { headers: headers });
  }

  registerUser(headers: HttpHeaders, userData: any): Observable<any> {
    return this.http
      .post(`${API_USER}/create`, userData, { headers: headers })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  editUser(headers: HttpHeaders, id: number, userData: any): Observable<any> {
    return this.http
      .patch(`${API_USER}/update/${id}`, userData, { headers: headers })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  deleteUser(headers: HttpHeaders, id: number): Observable<any> {
    return this.http
      .delete(`${API_USER}/delete/${id}`, { headers: headers })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  logoutUser(): Observable<any> {
    return this.http.post(`${API_AUTH}/signout`, {});
  }

  refreshTokenUser(token: string) {
    return this.http
      .post(`${API_AUTH}/refreshtoken`, { refreshToken: token })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  userIsAutenticaded(): boolean {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        console.error('Acesso a window.sessionStorage indisponível.');
        return false;
      }

      const user = window.sessionStorage.getItem(this.USER_KEY);
      return !!user;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }
}
