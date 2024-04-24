import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChartgroupService {
  private selectedChartPath: any;

  setSelectedChartPath(chartPath: any) {
    this.selectedChartPath = chartPath;
  }

  getSelectedChartPath(): any {
    return this.selectedChartPath;
  }
}
