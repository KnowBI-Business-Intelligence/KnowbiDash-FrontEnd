import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AUTH_API, USERS_API } from '../../environments/environment';

const API_USER = USERS_API;
const API_AUTH = AUTH_API;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private USER_KEY = 'auth-user';
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
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
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${API_USER}/get`, myHeaders);
  }

  getById(id: any, headers: HttpHeaders): Observable<any> {
    const myHeaders = {
      headers: headers,
    };

    return this.http.get(`${API_USER}/get/${id}`, myHeaders);
  }

  register(userData: any, headers: HttpHeaders): Observable<any> {
    const headersRegister = {
      headers: headers,
    };

    return this.http.post(`${API_USER}/create`, userData, headersRegister).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  edit(id: number, userData: any, headers: any): Observable<any> {
    const headersRgister = {
      headers: headers,
    };
    return this.http
      .patch(`${API_USER}/update/${id}`, userData, headersRgister)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  delete(id_user: number, headers: any): Observable<any> {
    const headersRgister = {
      headers: headers,
    };

    return this.http
      .delete(`${API_USER}/delete/${id_user}`, headersRgister)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${API_AUTH}/signout`, {});
  }

  refreshToken(token: string) {
    return this.http
      .post(`${API_AUTH}/refreshtoken`, { refreshToken: token })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  isAutenticaded(): boolean {
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
