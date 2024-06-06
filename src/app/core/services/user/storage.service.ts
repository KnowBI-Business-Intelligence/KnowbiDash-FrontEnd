import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';
const SECRET_KEY = 'mH#9@k3&!aDwFg2^';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, encryptedToken);

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
      const encryptedToken = window.sessionStorage.getItem(TOKEN_KEY);
      if (encryptedToken === null) {
        return null;
      }
      const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      const token = bytes.toString(CryptoJS.enc.Utf8);
      return token || null;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return null;
    }
  }

  public saveRefreshToken(token: string): void {
    const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, encryptedToken);
  }

  public getRefreshToken(): string | null {
    const encryptedToken = window.sessionStorage.getItem(REFRESHTOKEN_KEY);
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      const token = bytes.toString(CryptoJS.enc.Utf8);
      return token;
    }
    return null;
  }

  public saveUser(user: any): void {
    const encryptedUser = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      SECRET_KEY
    ).toString();
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, encryptedUser);
  }

  public getUser(): any {
    const encryptedUser = window.sessionStorage.getItem(USER_KEY);
    if (encryptedUser) {
      const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
      const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return user;
    }
    return {};
  }
}
