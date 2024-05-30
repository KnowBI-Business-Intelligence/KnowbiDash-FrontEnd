import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private itemId: any;

  setData(itemId: any) {
    this.itemId = itemId;
  }

  getData() {
    return { itemId: this.itemId };
  }
}
