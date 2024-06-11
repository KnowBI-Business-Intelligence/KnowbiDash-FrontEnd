import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';
const SECRET_KEY = 'mH#9@k3&!aDwFg2^';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isSessionStorageAvailable(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      typeof window.sessionStorage !== 'undefined'
    );
  }

  signOut(): void {
    if (this.isSessionStorageAvailable()) {
      window.sessionStorage.clear();
    }
  }

  public saveToken(token: string): void {
    if (this.isSessionStorageAvailable()) {
      const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.setItem(TOKEN_KEY, encryptedToken);

      const user = this.getUser();
      if (user.id) {
        this.saveUser({ ...user, accessToken: token });
      }
    }
  }

  public getToken(): string | null {
    if (!this.isSessionStorageAvailable()) {
      return null;
    }

    try {
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
    if (this.isSessionStorageAvailable()) {
      const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
      window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
      window.sessionStorage.setItem(REFRESHTOKEN_KEY, encryptedToken);
    }
  }

  public getRefreshToken(): string | null {
    if (!this.isSessionStorageAvailable()) {
      return null;
    }

    const encryptedToken = window.sessionStorage.getItem(REFRESHTOKEN_KEY);
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      const token = bytes.toString(CryptoJS.enc.Utf8);
      return token;
    }
    return null;
  }

  public saveUser(user: any): void {
    if (this.isSessionStorageAvailable()) {
      const encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(user),
        SECRET_KEY
      ).toString();
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, encryptedUser);
    }
  }

  public getUser(): any {
    if (!this.isSessionStorageAvailable()) {
      return {};
    }

    const encryptedUser = window.sessionStorage.getItem(USER_KEY);
    if (encryptedUser) {
      const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
      const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return user;
    }
    return {};
  }
}
