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

  register(
    username: string,
    occupation: string,
    email: string,
    fullusername: string,
    password: string,
    access_level: [],
    profiles: string,
    headers: HttpHeaders
  ): Observable<any> {
    const requestBody = {
      userName: username,
      cargo: occupation,
      email: email,
      fullUserName: fullusername,
      passWord: password,
      roles: [access_level],
      profiles: [profiles],
    };

    const headersRgister = {
      headers: headers,
    };

    return this.http
      .post(`${API_USER}/create`, requestBody, headersRgister)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  edit(
    id_user: number,
    username: string,
    occupation: string,
    email: string,
    fullusername: string,
    password: string,
    access_level: [],
    profiles: string,
    headers: any
  ): Observable<any> {
    const headersRgister = {
      headers: headers,
    };

    const requestBody = {
      userName: username,
      cargo: occupation,
      email: email,
      fullUserName: fullusername,
      passWord: password,
      roles: [access_level],
      profiles: [profiles],
    };

    return this.http
      .patch(`${API_USER}/update/${id_user}`, requestBody, headersRgister)
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
