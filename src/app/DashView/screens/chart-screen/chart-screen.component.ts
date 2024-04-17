import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';
import { StorageService } from '../../../services/service/user/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { ChartsService } from '../../../services/service/charts/charts.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart-screen',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule, FormsModule],
  templateUrl: './chart-screen.component.html',
  styleUrl: './chart-screen.component.css',
})
export class ChartScreenComponent implements AfterViewInit {
  loadingScreen!: boolean;
  Highcharts: typeof Highcharts = Highcharts;

  chartGroupsData: Highcharts.Options[] = [];
  filters: any[] = [];
  selectedFilters: any = {};
  chartObject: any;
  checkedValues: any = {};

  showModal: boolean = false;
  isLoginLoading: boolean = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private chartService: ChartsService
  ) {
    this.loadingScreen = true;
  }

  getCharts(): void {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.chartService.getCharts(headers).subscribe({
      next: (data) => {
        this.loadData(data);
      },
    });
  }

  loadData(chartData: any) {
    this.chartObject = JSON.parse(localStorage.getItem('chartGroup') || 'null');
    this.chartGroupsData = [];
    this.filters = [];

    chartData.forEach((chart: any) => {
      if (chart.chartGroup.id == this.chartObject) {
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
              dataType: 'string', // Aqui você pode determinar o tipo de dados do filtro
            });
          }
        });
      }
    });

    chartData.forEach((dataItem: any) => {
      if (dataItem.chartGroup.id == this.chartObject) {
        const seriesData: any[] = [];

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

        const chartConfig: Highcharts.Options = {
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
        };

        this.chartGroupsData.push(chartConfig);
      }
    });
  }

  onCheckboxChange(column: string, value: string) {
    if (this.checkedValues[column] === undefined) {
      this.checkedValues[column] = [];
    }

    const index = this.checkedValues[column].indexOf(value);
    if (index === -1) {
      this.checkedValues[column].push(value);
      console.log(`Checkbox marcado para ${value}`);
    } else {
      this.checkedValues[column].splice(index, 1);
      console.log(`Checkbox desmarcado para ${value}`);
    }
    this.updateDropdownLabel(column);
  }

  updateDropdownLabel(column: string): void {
    if (this.checkedValues[column] && this.checkedValues[column].length > 0) {
      this.selectedFilters[column] = this.checkedValues[column].join(', ');
      console.log('column: ', this.selectedFilters);
    } else {
      this.selectedFilters[column] = 'Todos';
      console.log('column: ', this.selectedFilters);
    }
  }

  backScreen() {
    this.router.navigate(['/content/main/chartgroup']);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  executeFilter() {
    this.isLoginLoading = true;
    setTimeout(() => {
      this.isLoginLoading = false;
    }, 2500);
    alert('tanka');
  }

  ngAfterViewInit(): void {
    this.getCharts();
  }
}
