import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private secretKey = 'mH#9@k3&!aDwFg2^';

  constructor() {}

  setEncryptedItem(key: string, value: any): void {
    const encryptedValue = this.encryptData(value);
    localStorage.setItem(key, encryptedValue);
  }

  getDecryptedItem(key: string): any {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      return this.decryptData(encryptedValue);
    }
    return null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  encryptData(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
    return encryptedData;
  }

  decryptData(encryptedData: string): any {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      this.secretKey
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}
