import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartLine,
  faChartPie,
  faRectangleList,
  faTableList,
} from '@fortawesome/free-solid-svg-icons';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { StorageService } from '../../../../core/services/user/storage.service';
interface Group {
  id: string;
  name: string;
}

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
  selector: 'app-dashboards-view',
  standalone: true,
  imports: [
    MatIconModule,
    FontAwesomeModule,
    CommonModule,
    SkeletonModule,
    HighchartsChartModule,
    FormsModule,
  ],
  templateUrl: './dashboards-view.component.html',
  styleUrl: './dashboards-view.component.css',
})
export class DashboardsViewComponent implements OnInit {
  icons = {
    dash: faChartPie,
    chartview: faChartLine,
    cardview: faRectangleList,
    tableview: faTableList,
  };

  groupName: string = '';

  changeBg: HTMLElement | null = null;
  paths: { [key: string]: Group[] } = {};
  pathNames: { [key: string]: string } = {};
  Highcharts: typeof Highcharts = Highcharts;

  chartGroupsData: Highcharts.Options[] = [];
  filters: any[] = [];
  selectedFilters: any = {};
  checkedValues: any = {};
  selectedGroupId: any = null;

  originalChartData: ChartData[] = [];
  chartData: ChartData[] = [];
  copydataJSON: any[] = [];

  showModal: boolean = false;
  isLoginLoading: boolean = false;
  user = this.storageService.getUser();

  constructor(
    private router: Router,
    private chartsService: ChartsService,
    private storageService: StorageService,
    private elementRef: ElementRef,
    private localStorageService: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.loadDataInit();
    const groupIdFromLocalStorage =
      this.localStorageService.getDecryptedItem('chartGroupview');
    this.getCharts(groupIdFromLocalStorage.id);
    const simulatedEvent = {
      currentTarget:
        this.elementRef.nativeElement.querySelector('.selected-group'),
    };
    this.clickPress(groupIdFromLocalStorage, simulatedEvent);
  }

  loadDataInit() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.getChartsPath(headers).subscribe({
      next: (data: any) => {
        this.processData(data);
      },
    });
  }

  getPathsArray() {
    return Object.keys(this.paths);
  }

  processData(data: any) {
    data.forEach((path: any) => {
      this.paths[path.id] = [];
      this.pathNames[path.id] = path.name;
    });
    this.getDashBoards(Object.keys(this.paths));
  }

  getDashBoards(dataPath: string[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.getChartGroup(headers).subscribe({
      next: (data: any) => {
        this.processDashboardsData(data, dataPath);
      },
    });
  }

  processDashboardsData(groupData: any, pathData: string[]) {
    groupData.forEach((data: any) => {
      if (pathData.includes(data.chartPath.id)) {
        this.paths[data.chartPath.id].push(data);
      }
    });
  }

  getCharts(id: string): void {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.chartsService.getCharts(headers).subscribe({
      next: (data: any) => {
        this.originalChartData = data;
        this.loadData(data, id);
      },
    });
  }

  loadData(chartData: ChartData[], groupId: any) {
    this.chartGroupsData = [];
    this.copydataJSON = [];
    this.filters = [];

    chartData.forEach((chart: any) => {
      if (chart.chartGroup && chart.chartGroup.id == groupId) {
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
      if (dataItem.chartGroup.id == groupId) {
        this.copydataJSON.push(dataItem);
        const uniqueCategories: any = Array.from(
          new Set(dataItem.xAxisColumns[0].data)
        );

        const uniqueSubgroups = Array.from(new Set(dataItem.series[0].data));

        const seriesData = uniqueSubgroups.map((subgrupo: any) => {
          const seriesValues: { name: string; y: any }[] = [];
          dataItem.xAxisColumns[0].data.forEach((date: string, i: number) => {
            if (dataItem.series[0].data[i] === subgrupo) {
              seriesValues.push({
                name: date,
                y: dataItem.yAxisColumns[0].data[i],
              });
            }
          });
          return {
            type: dataItem.graphType,
            name: subgrupo,
            data: seriesValues,
          };
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
            categories: uniqueCategories,
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
          plotOptions: {
            series: {
              cursor: 'pointer',
              point: {
                events: {
                  click: function () {
                    console.log('Coluna clicada:', this.category, this.y);
                  },
                },
              },
            },
          },
          filters: dataItem.filters,
        };

        this.chartGroupsData.push(chartConfig);
      }
    });

    console.log(this.copydataJSON);
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
    console.log(values, allFilters);
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

    console.log('Dados formatados:', requestData);

    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
    this.chartsService.updateCharts(id, requestData, headers).subscribe({
      next: () => {
        this.getCharts(id);
        this.chartGroupsData = [];
        this.copydataJSON = [];
      },
      error: () => {
        throw new Error('we had an error');
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

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }

  clickPress(group: any, event: any) {
    this.selectedGroupId = group;
    const encryptedData = {
      id: group.id,
      name: group.name,
    };
    const clickedButton = event ? event.currentTarget : null;
    const allButtons =
      this.elementRef.nativeElement.querySelectorAll('.dashboardbtn');
    allButtons.forEach((button: any) => {
      button.style.backgroundColor = '';
    });
    if (clickedButton) {
      clickedButton.style.backgroundColor = '#00000015';
    }
    this.groupName = group.name;
    this.localStorageService.setEncryptedItem('chartGroupview', encryptedData);
  }

  addView(buttonId: string) {
    if (buttonId == 'chart') {
      this.router.navigate(['/admin/dashboards/chart_view']);
    } else if (buttonId == 'card') {
      this.router.navigate(['/admin/dashboards/card_view']);
    } else if (buttonId == 'table') {
      this.router.navigate(['/admin/dashboards/table_view']);
    }
  }
}
