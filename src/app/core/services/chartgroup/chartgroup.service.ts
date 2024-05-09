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

  constructor() {}

  setSelectedChartPath(chartPath: any) {
    this.selectedChartPath = chartPath;
  }

  getSelectedChartPath(): any {
    return this.selectedChartPath;
  }

  setEncryptedData(data: any) {
    this.encryptedDataSubject.next(data);
  }

  setCurrentView(componentName: string): void {
    this.currentViewSubject.next(componentName);
  }

  getCurrentView(): Observable<string> {
    return this.currentViewSubject.asObservable();
  }
}
