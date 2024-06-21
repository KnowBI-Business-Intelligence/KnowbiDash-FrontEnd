import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartgroupService {
  private encryptedDataSubject = new BehaviorSubject<any>(null);
  encryptedData$ = this.encryptedDataSubject.asObservable();

  private currentViewSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('ViewCreateComponent');

  private selectedChartPath: any;
  private layoutId: any;
  private itemId: any;

  constructor() {}

  setSelectedChartPath(chartPath: any) {
    this.selectedChartPath = chartPath;
  }

  getSelectedChartPath(): any {
    return this.selectedChartPath;
  }

  setEncryptedData(data: any) {
    this.clearEncryptedData();
    this.encryptedDataSubject.next(data);
  }

  clearEncryptedData() {
    this.encryptedDataSubject.next(null);
  }

  setCurrentView(componentName: string): void {
    this.currentViewSubject.next(componentName);
  }

  getCurrentView(): Observable<string> {
    return this.currentViewSubject.asObservable();
  }

  clearCurrentView() {
    this.clearEncryptedData();
    this.currentViewSubject.next('ViewCreateComponent');
  }

  setData(layoutId: any, itemId: any) {
    this.layoutId = layoutId;
    this.itemId = itemId;
  }

  getData() {
    return { layoutId: this.layoutId, itemId: this.itemId };
  }

  clearData() {
    this.layoutId = null;
    this.itemId = null;
  }
}
