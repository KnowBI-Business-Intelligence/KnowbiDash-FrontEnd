import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private cookieService: CookieService) {}

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

    // salvando o refresh no cookie já que ele expira em 01 dia :D
    this.cookieService.set(TOKEN_KEY, token, { expires: 1 });

    const user = this.getUser();

    if (user.id) {
      this.saveUser({ ...user, accessToken: token });
    }
  }

  public getToken(): string | null {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        console.error('window.sessionStorage indisponível');
        return null;
      }
      const token = window.sessionStorage.getItem(TOKEN_KEY);
      if (token === null) {
        console.warn('Nenhum token encontrado.');
      }
      return token || '';
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return null;
    }
  }

  public saveRefreshToken(refreshToken: string): void {
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, refreshToken);

    // salvando o refresh no cookie já que ele não expira :D
    this.cookieService.set(REFRESHTOKEN_KEY, refreshToken);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);

    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  signOut(): void {
    window.sessionStorage.clear();
  }
}
