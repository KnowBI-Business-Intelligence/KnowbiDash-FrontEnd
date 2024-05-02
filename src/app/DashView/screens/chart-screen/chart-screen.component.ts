import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Highcharts, { Options } from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsService } from '../../../core/services/charts/charts.service';
import { LocalstorageService } from '../../../core/services/local-storage/local-storage.service';
import { StorageService } from '../../../core/services/user/storage.service';

interface ChartData {
  id: string;
  title: string;
  graphType: string;
  xAxisColumns: any[];
  yAxisColumns: any[];
  filters: any[];
}

interface ExtendedOptions extends Highcharts.Options {
  filters?: any;
}

@Component({
  selector: 'app-chart-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    CdkDropListGroup,
    HighchartsChartModule,
  ],
  templateUrl: './chart-screen.component.html',
  styleUrl: './chart-screen.component.css',
})
export class ChartScreenComponent implements OnInit {
  loadingScreen!: boolean;
  Highcharts: typeof Highcharts = Highcharts;

  chartGroupsData: Highcharts.Options[] = [];
  filters: any[] = [];
  selectedFilters: any = {};
  chartObject: any;
  checkedValues: any = {};

  originalChartData: ChartData[] = [];
  chartData: ChartData[] = [];
  copydataJSON: any[] = [];

  showModal: boolean = false;
  isLoginLoading: boolean = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private chartService: ChartsService,
    private localStorage: LocalstorageService
  ) {
    this.loadingScreen = true;
  }

  ngOnInit(): void {
    const storedItems = localStorage.getItem('items');

    if (storedItems !== null) {
      this.chartGroupsData = JSON.parse(storedItems) as Highcharts.Options[];
    }
    this.getCharts();
  }

  drop(event: CdkDragDrop<Options[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    window.localStorage.setItem('items', JSON.stringify(this.chartGroupsData));
  }

  getCharts(): void {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.chartService.getCharts(headers).subscribe({
      next: (data: any) => {
        this.originalChartData = data;
        this.loadData(data);
      },
    });
  }

  loadData(chartData: ChartData[]) {
    this.chartObject = JSON.parse(
      this.localStorage.getDecryptedItem('chartGroup') || 'null'
    );
    this.chartGroupsData = [];
    this.copydataJSON = [];
    this.filters = [];

    chartData.forEach((chart: any) => {
      if (chart.chartGroup && chart.chartGroup.id == this.chartObject) {
        chart.filters.forEach((filter: any) => {
          const existingFilter = this.filters.find(
            (f) => f.column === filter.column[0]
          );
          if (existingFilter) {
            if (!existingFilter.values.includes(filter.value[0])) {
              existingFilter.values.push(filter.value[0]);
            }
          } else {
            this.filters.push({
              column: filter.column[0],
              values: filter.value,
              identifiers: filter.identifiers,
              allfilters: filter.allfilters,
            });
          }
        });
      }
    });

    chartData.forEach((dataItem: any) => {
      if (dataItem.chartGroup.id == this.chartObject) {
        const seriesData: any[] = [];
        this.copydataJSON.push(dataItem);
        dataItem.xAxisColumns.forEach((xAxisColumn: any, index: number) => {
          const yAxisColumn = dataItem.yAxisColumns[index];
          const seriesName = yAxisColumn ? yAxisColumn.name[0] : '';

          const seriesValues = xAxisColumn.data.map((value: any, i: number) => {
            const yValue = yAxisColumn ? parseFloat(yAxisColumn.data[i]) : null;

            return {
              name: value,
              y: yValue,
            };
          });

          seriesData.push({
            name: seriesName,
            data: seriesValues,
          });
        });

        const chartConfig: ExtendedOptions = {
          chart: {
            type: dataItem.graphType,
          },
          title: {
            text: dataItem.title,
            style: {
              fontSize: '14px',
            },
          },
          xAxis: {
            categories: dataItem.xAxisColumns[0].data,
            title: {
              text: dataItem.xAxisColumns[0].name[0],
            },
          },
          yAxis: {
            title: {
              text: dataItem.yAxisColumns[0].name[0],
            },
          },
          series: seriesData,
          tooltip: {
            shared: true,
          },
          filters: dataItem.filters,
        };

        this.chartGroupsData.push(chartConfig);
      }
    });
  }

  onCheckboxChange(column: string, value: string) {
    if (!this.checkedValues[column]) {
      this.checkedValues[column] = [];
    }

    const index = this.checkedValues[column].indexOf(value);
    if (index === -1) {
      this.checkedValues[column].push(value);
    } else {
      this.checkedValues[column].splice(index, 1);
    }

    this.updateDropdownLabel(column);
  }

  isChecked(column: string, value: string): boolean {
    return (
      this.checkedValues[column] && this.checkedValues[column].includes(value)
    );
  }

  updateDropdownLabel(column: string): void {
    if (this.checkedValues[column] && this.checkedValues[column].length > 0) {
      this.selectedFilters[column] = this.checkedValues[column].join(', ');
    } else {
      this.selectedFilters[column] = 'Todos';
    }
  }

  allValuesMatchAllFilters(values: any[], allFilters: any[]): boolean {
    return values.every((value) => allFilters.includes(value));
  }

  executeFilter() {
    if (this.copydataJSON.length > 0) {
      const filteredChartData = JSON.parse(JSON.stringify(this.copydataJSON));
      for (const chartGroup of filteredChartData) {
        if (chartGroup.filters) {
          for (const filter of chartGroup.filters) {
            const selectedValue = this.selectedFilters[filter.column[0]];
            if (selectedValue && selectedValue !== 'Todos') {
              filter.value = selectedValue.split(', ');
            }
          }
        }
      }
      this.updateChartGroupsData(filteredChartData);
    }
  }

  updateChartGroupsData(filteredChartData: any[]) {
    filteredChartData.forEach((data: any) => {
      data.xAxisColumns.forEach((dat: any) => {
        dat.data = [];
      });
      this.updateChart(
        data.id,
        data.sql,
        data.xAxisColumns,
        data.yAxisColumns,
        data.filters
      );
    });
  }

  updateChart(
    id: string,
    sql: string,
    xAxisColumns: any[],
    yAxisColumns: any[],
    filters: any[]
  ) {
    const formattedXAxisColumns = xAxisColumns.map((column) => ({
      name: column.column,
      identifiers: column.name,
    }));

    const formattedYAxisColumns = yAxisColumns.map((column) => ({
      name: column.column,
      identifiers: column.name,
    }));

    const formattedFilters = filters.map((filter) => ({
      column: filter.column,
      operator: filter.operator,
      value: filter.value,
      identifiers: filter.identifiers,
    }));

    const requestData = {
      sql: sql,
      xAxisColumns: formattedXAxisColumns,
      yAxisColumns: formattedYAxisColumns,
      filters: formattedFilters,
    };

    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
    this.chartService.updateCharts(id, requestData, headers).subscribe({
      next: () => {
        this.getCharts();
        this.chartGroupsData = [];
        this.copydataJSON = [];
      },
      error: (error: Error) => {
        throw new Error('Erro ao atualizar o gráfico:', error);
      },
    });
  }

  openModal(): void {
    let filterValuesByColumn: { [key: string]: string[] } = {};

    this.chartGroupsData.forEach((data: any) => {
      data.filters.forEach((filter: any) => {
        if (!(filter.column[0] in filterValuesByColumn)) {
          filterValuesByColumn[filter.column[0]] = [];
        }
        filter.value.forEach((value: string) => {
          if (!filterValuesByColumn[filter.column[0]].includes(value)) {
            filterValuesByColumn[filter.column[0]].push(value);
          }
        });
      });
    });

    this.filters.forEach((filter: any) => {
      filter.values = filterValuesByColumn[filter.column];
    });

    this.showModal = !this.showModal;
  }

  backScreen() {
    this.router.navigate(['/content/chartgroup']);
  }
}
