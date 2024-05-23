import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private layout: any[] = [];

  constructor() {}

  setLayout(layout: any[]) {
    this.layout = layout;
  }

  getLayout(): any[] {
    return this.layout;
  }
}
