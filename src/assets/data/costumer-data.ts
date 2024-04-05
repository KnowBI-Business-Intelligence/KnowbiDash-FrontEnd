import { Injectable } from '@angular/core';

@Injectable()
export class CustomerService {
  processUserData(data: any): [] {
    return data;
  }

  getCustomersMini(userData: any) {
    return Promise.resolve(this.processUserData(userData).slice(0, 5));
  }

  getCustomersSmall(userData: any) {
    return Promise.resolve(this.processUserData(userData).slice(0, 10));
  }

  getCustomersMedium(userData: any) {
    return Promise.resolve(this.processUserData(userData).slice(0, 50));
  }

  getCustomersLarge(userData: any): Promise<any[]> {
    const auxData = userData;
    this.processUserData(userData).slice(0, 200);

    return Promise.resolve(auxData);
  }

  getCustomersXLarge(userData: any) {
    return Promise.resolve(this.processUserData(userData));
  }
}
