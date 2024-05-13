import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/user/storage.service';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';
import { MatTableModule } from '@angular/material/table';
import Highcharts from 'highcharts';
import { HttpHeaders } from '@angular/common/http';

interface Group {
  id: string;
  name: string;
}

interface TableRow {
  [key: string]: any;
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
  selector: 'app-adm-main-charts',
  standalone: true,
  imports: [
    MatIconModule,
    FontAwesomeModule,
    CommonModule,
    SkeletonModule,
    HighchartsChartModule,
    FormsModule,
    AngularDraggableModule,
    MatTableModule,
  ],
  templateUrl: './adm-main-charts.component.html',
  styleUrl: './adm-main-charts.component.css',
})
export class AdmMainChartsComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  name = 'Angular';
  position!: string;
  groupName: string = '';
  tableTitle: string = '';
  chartConfig: any;
  currentView: any;
  changeBg: HTMLElement | null = null;
  paths: { [key: string]: Group[] } = {};
  pathNames: { [key: string]: string } = {};
  Highcharts: typeof Highcharts = Highcharts;
  displayedColumns: string[] = [];
  displayedRows: TableRow[] = [];
  chartGroupsData: Highcharts.Options[] = [];
  cardGroupsData: any[] = [];
  tableGroupsData: any[] = [];
  filters: any[] = [];
  selectedFilters: any = {};
  checkedValues: any = {};
  copydataJSON: any[] = [];
  selectedGroupId: any = null;
  originalChartData: ChartData[] = [];
  chartData: ChartData[] = [];
  cardsData: any[] = [];
  tableData: any[] = [];
  showModal: boolean = false;
  isLoginLoading: boolean = false;
  user = this.storageService.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private router: Router,
    private storageService: StorageService,
    private chartsService: ChartsService,
    private localStorage: LocalstorageService
  ) {}
  ngOnInit(): void {
    const storedChartGroupString =
      this.localStorage.getDecryptedItem('chartGroup');
    const storedChartGroup = JSON.parse(storedChartGroupString);
    this.getCharts(storedChartGroup.id);
    this.getCards(storedChartGroup.id);
    this.getTables(storedChartGroup.id);
    this.groupName = storedChartGroup.name;
    console.log(storedChartGroup);
  }

  getCharts(id: string): void {
    this.chartsService.getCharts(this.headers).subscribe({
      next: (data) => {
        this.originalChartData = data;
        this.loadData(data, id);
      },
    });
  }

  getCards(id: string): void {
    this.chartsService.getCards(this.headers).subscribe({
      next: (data) => {
        this.loadCards(data, id);
      },
    });
  }

  getTables(id: string): void {
    this.chartsService.getTables(this.headers).subscribe({
      next: (data) => {
        this.loadTables(data, id);
      },
    });
  }

  loadCards(cardData: any, groupId: any) {
    this.cardGroupsData = [];
    cardData.forEach((card: any) => {
      if (card.chartGroup.id == groupId) {
        console.log(card);

        let result = null;
        if (typeof card.result === 'number') {
          result = this.formatterResultWhenDecimal(card.result);
        } else {
          result = card.result;
        }
        let cardTitle = card.title;
        let cardResult = card.prefix + '' + result + ' ' + card.sufix;

        let finalData = {
          title: cardTitle,
          content: cardResult,
        };

        this.cardGroupsData.push(finalData);
      }
    });
  }

  loadTables(tableData: any, groupId: any) {
    this.tableGroupsData = [];
    tableData.forEach((table: any) => {
      if (
        table.chartGroup.id == groupId &&
        table.tableData &&
        table.tableData.length > 0
      ) {
        const tableGroup: any = {
          title: table.title,
          columns: [],
          rows: [],
        };

        table.tableData.forEach((rowData: any) => {
          rowData.th.forEach((th: string) => {
            if (!tableGroup.columns.includes(th)) {
              tableGroup.columns.push(th);
            }
          });
        });

        const numRows = table.tableData[0].td.length;
        for (let i = 0; i < numRows; i++) {
          const row: any = {};
          table.tableData.forEach((rowData: any) => {
            rowData.th.forEach((th: string, index: number) => {
              row[th] = rowData.td[i];
            });
          });
          tableGroup.rows.push(row);
        }

        this.tableGroupsData.push(tableGroup);
      }
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
            height: '20%',
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
              fontSize: '12px',
            },
          },
          xAxis: {
            categories: uniqueCategories,
            title: {
              text: dataItem.xAxisColumns[0].name[0],
            },
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
          yAxis: {
            title: {
              text: dataItem.yAxisColumns[0].name[0],
            },
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
          series: seriesData,
          tooltip: {
            shared: true,
          },
          legend: {
            maxHeight: 65,
            itemStyle: {
              fontSize: '10px',
            },
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
    this.chartsService.updateCharts(headers, requestData, id).subscribe({
      next: (data: any) => {
        console.log('Gráfico atualizado:', data);
        this.getCharts(id);
        this.chartGroupsData = [];
        this.copydataJSON = [];
      },
      error: (error: any) => {
        console.error('Erro ao atualizar o gráfico:', error);
      },
    });
  }

  formatterResultWhenDecimal(result: number): string {
    let formattedResult;
    if (Number.isInteger(result)) {
      formattedResult = result.toLocaleString('pt-BR');
    } else {
      formattedResult = result.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return formattedResult;
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
    this.router.navigate(['/admin/adm_main_dashboard']);
  }

  newPosition(event: any) {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const element = event.currentTarget;
    const x = element.offsetLeft;
    const y = element.offsetTop;

    this.position = '(' + x + ', ' + y + ')';
    console.log('yeah');
  }

  resizeChart() {
    const chartWidth = this.chartContainer.nativeElement.offsetWidth;
    const chartHeight = this.chartContainer.nativeElement.offsetHeight;
    if (this.chartConfig && this.chartConfig.chart) {
      this.chartConfig.chart.width = chartWidth;
      this.chartConfig.chart.height = chartHeight;
    }
  }
}
