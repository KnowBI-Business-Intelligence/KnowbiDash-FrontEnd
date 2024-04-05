import { Injectable } from '@angular/core';

@Injectable()
export class PayableService {
  processUserData(data: any): [] {
    return data;
  }

  getPayableMini(userData: any) {
    return Promise.resolve(this.processUserData(userData).slice(0, 5));
  }

  getPayableSmall(userData: any) {
    return Promise.resolve(this.processUserData(userData).slice(0, 10));
  }

  getPayableMedium(userData: any) {
    return Promise.resolve(this.processUserData(userData).slice(0, 50));
  }

  getPayableLarge(userData: any): Promise<any[]> {
    const auxData = userData;
    this.processUserData(userData).slice(0, 200);

    return Promise.resolve(auxData);
  }

  getPayableXLarge(userData: any) {
    return Promise.resolve(this.processUserData(userData));
  }

  // getCustomers(params?: any) {
  //   return this.http
  //     .get<any>('https://www.primefaces.org/data/customers', { params: params })
  //     .toPromise();
  // }
}
