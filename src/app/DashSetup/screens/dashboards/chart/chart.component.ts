import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  CdkMenu,
  CdkMenuGroup,
  CdkMenuItem,
  CdkMenuItemCheckbox,
  CdkMenuItemRadio,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDatabase, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { chartButtonsData } from './chartbuttons';

interface Axis {
  name: string;
  type: string;
  identifier: string;
  value: '';
}

interface ExtendedOptions extends Highcharts.Options {
  filters?: any;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    FontAwesomeModule,
    CommonModule,
    HighchartsChartModule,
    FormsModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItemCheckbox,
    CdkMenuGroup,
    CdkMenuItemRadio,
    CdkMenuItem,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  icons = {
    database: faDatabase,
    close: faXmark,
    edit: faGear,
  };

  dashBoard: any;
  chartId: any;
  titulo: string = '';
  chartType: string = '';
  sql: string = 'SELECT ';
  tableName: string = '';
  identifier: string = '';
  selectedAggregation: string = '';

  selectedChartButton: string = '';
  showPreviewButton: boolean = true;
  showModal: boolean = false;
  modal: HTMLElement | undefined;

  selectedYAxis: Axis = { name: '', type: '', identifier: '', value: '' };
  buildData: { name: any; identifier: any }[] = [];
  yAxisValueWithoutAggregation: string = '';
  yaxisData: { [key: string]: string } = {};
  yaxisIdentifiers: { [key: string]: string } = {};

  Highcharts: typeof Highcharts = Highcharts;
  chartConfig!: ExtendedOptions;
  group: any;

  chartButtons = chartButtonsData;
  user = this.storageService.getUser();
  constructor(
    private router: Router,
    private storageService: StorageService,
    private localStorageService: LocalstorageService,
    private chartsService: ChartsService
  ) {}

  database: any[] = [];
  yaxis: any[] = [];
  xaxis: any[] = [];
  series: any[] = [];
  filters: any[] = [];
  groupment: any[] = [];
  order: any[] = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngOnInit(): void {
    this.dashBoard =
      this.localStorageService.getDecryptedItem('chartGroupview');
    this.loadDataView(this.dashBoard.id);
  }

  openMenu(index: number, item: any) {
    this.selectedYAxis = item;
    this.yaxis[index].identifier = this.identifier;
  }

  AxisValue(item: any) {
    this.selectedYAxis = item;
    if (this.identifier == '' || this.identifier == undefined) {
      this.identifier = this.selectedYAxis.name;
    } else {
      this.identifier = this.selectedYAxis.identifier;
    }
  }

  loadDataView(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.getChartGroup(headers).subscribe({
      next: (data) => {
        data.forEach((getId: any) => {
          if (id == getId.id) {
            this.tableName = getId.pgTableName;
            this.processData(getId);
          }
        });
      },
    });
  }

  processData(data: any) {
    data.columns.forEach((setData: any) => {
      this.database.push(setData);
      this.yaxisData[setData.name] = setData;
      if (!setData.identifier || setData.identifier.trim() === '') {
        setData.identifier = setData.name;
        setData.value = setData.name;
      }

      if (setData.type === 'timestamp') {
        const parts = ['(dia)', '(mês)', '(ano)'];
        parts.forEach((part) => {
          let value = '';
          if (part === '(dia)') {
            value = `DATE_TRUNC('day', ${this.rmTimeStamp(setData.name)})`;
          } else if (part === '(mês)') {
            value = `DATE_TRUNC('month', ${this.rmTimeStamp(setData.name)})`;
          } else if (part === '(ano)') {
            value = `DATE_TRUNC('year', ${this.rmTimeStamp(setData.name)})`;
          }

          const name = `${setData.name}${part}`;
          const identifier = `${setData.identifier}${part}`;
          const timestampPart = {
            name: name,
            type: 'timestamp',
            identifier: this.rmTimeStamp(identifier),
            value: value,
          };
          this.database.push(timestampPart);
        });
      }
    });
  }

  removeItem(list: string, index: number) {
    switch (list) {
      case 'yaxis':
        this.yaxis.splice(index, 1);
        break;
      case 'xaxis':
        this.xaxis.splice(index, 1);
        break;
      case 'series':
        this.series.splice(index, 1);
        break;
      case 'filters':
        this.filters.splice(index, 1);
        break;
      case 'groupment':
        this.groupment.splice(index, 1);
        break;
      case 'order':
        this.order.splice(index, 1);
        break;
      default:
        break;
    }
  }

  extractValue(aggregation: string) {
    if (this.selectedYAxis) {
      const yAxisName = this.selectedYAxis.name;
      const columnNameRegex = /^(?:AVG|COUNT|SUM)\(([^)]+)\)$/;

      if (columnNameRegex.test(yAxisName)) {
        const columnName = yAxisName.replace(columnNameRegex, '$1');
        const newAggregationValue = aggregation + '(' + columnName + ')';

        const updatedAxis = {
          name: newAggregationValue,
          identifier: this.selectedYAxis.identifier
            ? this.selectedYAxis.identifier
            : this.selectedYAxis.name,
          value: columnName,
        };

        const index = this.yaxis.findIndex((item) => item.name === yAxisName);
        if (index !== -1) {
          this.yaxis[index] = updatedAxis;
        }
      } else {
        const aggregationValue = aggregation + '(' + yAxisName + ')';
        const index = this.yaxis.findIndex((item) => item.name === yAxisName);
        if (index !== -1) {
          this.yaxis[index] = {
            name: aggregationValue,
            identifier: this.selectedYAxis.identifier
              ? this.selectedYAxis.identifier
              : this.selectedYAxis.name,
            value: yAxisName,
          };
        }
      }
    }
  }

  editSave() {
    if (this.selectedYAxis) {
      this.selectedYAxis.identifier = this.identifier
        ? this.identifier
        : this.selectedYAxis.name;
      this.yaxisIdentifiers[this.selectedYAxis.name] =
        this.selectedYAxis.identifier;
    }
  }

  identifierData() {
    this.buildData = [];
    for (let i = 0; i < this.yaxis.length; i++) {
      const yAxisItem = this.yaxis[i].name;
      const yAxisidentifier = this.yaxis[i].value;
      let identifierItem = yAxisidentifier;
      const hasAggregation = /^(?:AVG|COUNT|SUM)\([^)]+\)$/.test(
        identifierItem
      );
      if (hasAggregation) {
        identifierItem = this.rmAgregateReplace(identifierItem);
      }

      this.buildData.push({ name: yAxisItem, identifier: identifierItem });
    }

    for (let i = 0; i < this.xaxis.length; i++) {
      const xAxisItem = this.xaxis[i].value;
      const xAxisidentifier = this.rmTimeStamp(this.xaxis[i].name);
      this.buildData.push({ name: xAxisItem, identifier: xAxisidentifier });
    }

    for (let i = 0; i < this.series.length; i++) {
      const seriesItem = this.series[i].value;
      const seriesidentifier = this.rmTimeStamp(this.series[i].name);
      this.buildData.push({ name: seriesItem, identifier: seriesidentifier });
    }

    this.sql = 'SELECT ';
    if (this.buildData.length > 0) {
      const selectClauses = this.buildData.map((item) => {
        return `${item.name} AS ${item.identifier}`;
      });
      this.sql += selectClauses.join(', ');
    }

    if (this.buildData.length > 0) {
      this.sql += ` FROM ${this.tableName}`;
    }
  }

  seedData() {
    this.showPreviewButton = false;
    this.identifierData();

    const xAxisValues = this.xaxis.map((axis) => this.rmTimeStamp(axis.name));
    const seriesValues = this.series.map((series) =>
      this.rmTimeStamp(series.value)
    );
    const group = [...xAxisValues, ...seriesValues];

    const chartData = {
      title: this.titulo,
      graphType: this.chartType.toLowerCase(),
      sql: this.sql,
      xAxisColumns: this.xaxis.map((axis) => {
        return {
          name: [this.rmTimeStamp(axis.name)],
          identifiers: [axis.identifier],
        };
      }),
      yAxisColumns: this.yaxis.map((axis) => {
        return {
          name: [this.rmTimeStamp(axis.value)],
          identifiers: [axis.identifier],
        };
      }),
      series: this.series.map((series) => {
        return {
          name: [this.rmTimeStamp(series.name)],
          identifiers: [series.identifier],
        };
      }),
      filters: this.filters.map((filter) => {
        let operator;
        if (filter.type === 'timestamp' || filter.type === 'number') {
          operator = 'BETWEEN';
        } else {
          operator = 'IN';
        }

        return {
          column: [this.rmTimeStamp(filter.name)],
          operator: [operator],
          value: [],
          identifiers: [filter.identifier],
        };
      }),
      group: group,
      order: this.order.length
        ? this.order.map((order) => this.rmTimeStamp(order.name))
        : xAxisValues,
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    this.createChart(chartData);
  }

  createChart(chartData: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.createCharts(headers, chartData).subscribe({
      next: (data) => {
        this.chartPreView(data);
        this.chartId = data.id;
        this.updateChart();
      },
    });
  }

  updateChart() {
    this.identifierData();

    const xAxisValues = this.xaxis.map((axis) => this.rmTimeStamp(axis.name));
    const seriesValues = this.series.map((series) =>
      this.rmTimeStamp(series.value)
    );
    const group = [...xAxisValues, ...seriesValues];
    const chartData = {
      title: this.titulo,
      graphType: this.chartType.toLowerCase(),
      sql: this.sql,
      xAxisColumns: this.xaxis.map((axis) => {
        return {
          name: [this.rmTimeStamp(axis.name)],
          identifiers: [axis.identifier],
        };
      }),
      yAxisColumns: this.yaxis.map((axis) => {
        return {
          name: [this.rmTimeStamp(axis.value)],
          identifiers: [axis.identifier],
        };
      }),
      series: this.series.map((series) => {
        return {
          name: [this.rmTimeStamp(series.name)],
          identifiers: [series.identifier],
        };
      }),
      filters: this.filters.map((filter) => {
        let operator;
        if (filter.type === 'timestamp' || filter.type === 'number') {
          operator = 'BETWEEN';
        } else {
          operator = 'IN';
        }

        return {
          column: [this.rmTimeStamp(filter.name)],
          operator: [operator],
          value: [],
          identifiers: [filter.identifier],
        };
      }),
      group: group,
      order: this.order.length
        ? this.order.map((order) => this.rmTimeStamp(order.name))
        : xAxisValues,
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService
      .updateCharts(headers, chartData, this.chartId)
      .subscribe({
        next: (data) => {
          this.chartPreView(data);
        },
      });
  }

  chartPreView(data: any) {
    console.log(data);
    this.chartConfig = {
      chart: {
        type: data.graphType,
      },
      title: {
        text: this.titulo,
        style: {
          fontSize: '14px',
        },
      },
      xAxis: {
        categories: ['UNIMED', 'CASF', 'Bradesco', 'CASSI'],
        title: {
          style: {
            fontSize: '12px',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Atendimentos',
          style: {
            fontSize: '12px',
          },
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true,
      },
      series: [
        {
          type: data.graphType,

          data: [631, 727, 3202, 721],
        },
      ],
    };
  }

  selectChartButton(label: string, value: string) {
    this.selectedChartButton = label;
    this.chartType = value;
  }

  backScreen() {
    this.router.navigate(['/admin/dashboards']);
  }

  openModalCancel() {
    this.backScreen();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  rmAgregateReplace(item: string) {
    return item.replace(/^(?:AVG|COUNT|SUM|mês)\(([^)]+)\)$/, '$1');
  }

  rmTimeStamp(item: string) {
    return item.replace(/\((?:dia|mês|ano)\)/, '');
  }
}
