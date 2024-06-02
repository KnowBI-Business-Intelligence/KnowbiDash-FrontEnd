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
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { ChartgroupService } from '../../../../core/services/chartgroup/chartgroup.service';
import { DataService } from '../../../../core/services/dashboard/data.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Axis {
  name: string;
  type: string;
  identifiers: string;
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
    ToastModule,
  ],
  templateUrl: './chart.component.html',
  styleUrls: [
    './chart.component.css',
    '../../../../core/globalStyle/toast.css',
  ],
})
export class ChartComponent implements OnInit {
  @Output() returnToCreate = new EventEmitter<void>();
  icons = {
    database: faDatabase,
    close: faXmark,
    edit: faGear,
  };
  private encryptedDataSubscription: Subscription | undefined;
  private xAxisColumns: any[] = [];
  private yAxisColumns: any[] = [];
  private seriesData: any[] = [];
  private filtersData: any[] = [];
  private xAxisValues: any[] = [];
  private seriesValues: any[] = [];
  private orderInfo: any[] = [];
  private groupData: any[] = [];
  database: any[] = [];
  yaxis: any[] = [];
  xaxis: any[] = [];
  series: any[] = [];
  filters: any[] = [];
  groupment: any[] = [];
  order: any[] = [];
  dashBoard: any;
  chartId: any;
  itemId: any;
  titulo: string = '';
  chartType: string = '';
  sql: string = 'SELECT ';
  tableName: string = '';
  identifiers: string = '';
  selectedAggregation: string = '';
  selectedChartButton: string = '';
  showPreviewButton: boolean = true;
  showModal: boolean = false;
  modal: HTMLElement | undefined;
  selectedYAxis: Axis = { name: '', type: '', identifiers: '', value: '' };
  buildData: { name: any; identifiers: any }[] = [];
  yAxisValueWithoutAggregation: string = '';
  yaxisData: { [key: string]: string } = {};
  yaxisIdentifiers: { [key: string]: string } = {};
  Highcharts: typeof Highcharts = Highcharts;
  chartConfig!: ExtendedOptions;
  group: any;

  chartButtons = chartButtonsData;
  private user = this.storageService.getUser();
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private router: Router,
    private storageService: StorageService,
    private localStorageService: LocalstorageService,
    private chartsService: ChartsService,
    private chartGroupService: ChartgroupService,
    private dataService: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.startDashboarData();
  }

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

  openMenu(index: number, item: any) {
    this.selectedYAxis = item;
    this.yaxis[index].identifiers = this.identifiers;
  }

  AxisValue(item: any) {
    this.selectedYAxis = item;
    if (this.identifiers == '' || this.identifiers == undefined) {
      this.identifiers = this.selectedYAxis.name;
    } else {
      this.identifiers = this.selectedYAxis.identifiers;
    }
  }

  startDashboarData() {
    this.encryptedDataSubscription =
      this.chartGroupService.encryptedData$.subscribe((encryptedData) => {
        this.dashBoard = encryptedData;
        this.loadDataView(this.dashBoard.id);
        console.log(this.dashBoard);
      });
  }

  loadDataView(id: string) {
    this.chartsService.getChartGroup(this.headers).subscribe({
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

  returnToCreateView(): void {
    this.chartGroupService.setCurrentView('ViewCreateComponent');
  }

  startEditData() {
    const data = this.dataService.getData();
    this.itemId = data.itemId;
    console.log('Item ID:', this.itemId);
    if (this.itemId != undefined) {
      this.showPreviewButton = false;
      this.loadChartEdit(this.itemId);
    }
  }

  clearAxisData() {
    this.database = [];
    this.yaxis = [];
    this.xaxis = [];
    this.series = [];
    this.filters = [];
    this.group = [];
    this.order = [];
  }

  processData(data: any) {
    this.clearAxisData();
    this.startEditData();
    data.columns.forEach((setData: any) => {
      this.database.push(setData);
      this.yaxisData[setData.name] = setData;
      if (!setData.identifiers || setData.identifiers.trim() === '') {
        setData.identifiers = setData.name;
        setData.value = setData.name;
      }

      if (setData.type === 'timestamp') {
        const parts = ['(dia)', '(mês)', '(ano)'];
        parts.forEach((part) => {
          let value = '';
          if (part === '(dia)') {
            value = `DATE_TRUNC('day', ${this.rmTimeStamp(setData.name)})`;
          } else if (part === '(mês)') {
            value = `mes_por_extenso(DATE_TRUNC('month', ${this.rmTimeStamp(
              setData.name
            )}))`;
          } else if (part === '(ano)') {
            value = `ano_por_extenso(DATE_TRUNC('year', ${this.rmTimeStamp(
              setData.name
            )}))`;
          }

          const name = `${setData.name}${part}`;
          const identifiers = `${setData.identifiers}${part}`;
          const timestampPart = {
            name: name,
            type: 'timestamp',
            identifiers: this.rmTimeStamp(identifiers),
            value: value,
            agregator: name,
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
          identifiers: this.selectedYAxis.identifiers
            ? this.selectedYAxis.identifiers
            : this.selectedYAxis.name,
          type: this.selectedYAxis.type,
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
            identifiers: this.selectedYAxis.identifiers
              ? this.selectedYAxis.identifiers
              : this.selectedYAxis.name,
            type: this.selectedYAxis.type,
            value: yAxisName,
          };
        }
      }
    }
  }

  editSave() {
    if (this.selectedYAxis) {
      this.selectedYAxis.identifiers = this.identifiers
        ? this.identifiers
        : this.selectedYAxis.name;
      this.yaxisIdentifiers[this.selectedYAxis.name] =
        this.selectedYAxis.identifiers;
    }
  }

  identifierData() {
    this.buildData = [];
    for (let i = 0; i < this.yaxis.length; i++) {
      const yAxisItem = this.yaxis[i].name;
      const yAxisidentifiers = this.yaxis[i].value;
      let identifierItem = yAxisidentifiers;
      const hasAggregation = /^(?:AVG|COUNT|SUM)\([^)]+\)$/.test(
        identifierItem
      );
      if (hasAggregation) {
        identifierItem = this.rmAgregateReplace(identifierItem);
      }

      this.buildData.push({ name: yAxisItem, identifiers: identifierItem });
    }

    for (let i = 0; i < this.xaxis.length; i++) {
      const xAxisItem = this.xaxis[i].value;
      const xAxisidentifiers = this.rmTimeStamp(this.xaxis[i].name);
      this.buildData.push({ name: xAxisItem, identifiers: xAxisidentifiers });
    }

    for (let i = 0; i < this.series.length; i++) {
      const seriesItem = this.series[i].value;
      const seriesidentifiers = this.rmTimeStamp(this.series[i].name);
      this.buildData.push({ name: seriesItem, identifiers: seriesidentifiers });
    }

    if (this.itemId == undefined) {
      this.sql = 'SELECT ';
      if (this.buildData.length > 0) {
        const selectClauses = this.buildData.map((item) => {
          console.log(item);
          return `${item.name} AS ${item.identifiers}`;
        });
        this.sql += selectClauses.join(', ');
      }

      if (this.buildData.length > 0) {
        this.sql += ` FROM ${this.tableName}`;
      }
    }
  }

  dataRepo() {
    this.xAxisValues = this.xaxis.map((axis) => {
      if (this.isTimestampField(axis.name)) {
        return this.formatTimestampField(axis.name);
      }
      return this.rmTimeStamp(axis.name);
    });

    console.log(this.order);

    this.seriesValues = this.series.map((series) =>
      this.rmTimeStamp(series.value)
    );

    this.groupData = [...this.xAxisValues, ...this.seriesValues];

    this.yAxisColumns = this.yaxis.map((axis) => {
      return {
        name: [this.rmTimeStamp(axis.value)],
        identifiers: [axis.identifiers],
        agregator: [axis.name],
        type: [axis.type],
      };
    });

    this.xAxisColumns = this.xaxis.map((axis) => {
      return {
        name: [this.rmTimeStamp(axis.name)],
        identifiers: [axis.identifiers],
        agregator: [axis.name],
        type: [axis.type],
      };
    });

    this.seriesData = this.series.map((series) => {
      return {
        name: [this.rmTimeStamp(series.name)],
        identifiers: [series.identifiers],
        agregator: [series.name],
        type: [series.type],
      };
    });

    this.orderInfo = this.order.map((orderinfo) => {
      return {
        name: orderinfo.name,
        identifiers: orderinfo.identifiers,
        agregator: orderinfo.name,
        type: orderinfo.type,
      };
    });
    console.log(this.orderInfo);
    this.filtersData = this.filters.map((filter) => {
      console.log(filter);
      let operator;
      let idenfiersOpt;
      if (filter.type === 'timestamp' || filter.type === 'numeric') {
        operator = 'BETWEEN';
      } else {
        operator = 'IN';
      }

      if (filter.type == 'numeric' && filter.identifiers == undefined) {
        idenfiersOpt = this.rmTimeStamp(filter.name);
      } else {
        idenfiersOpt = filter.identifiers;
      }

      return {
        column: [this.rmTimeStamp(filter.name)],
        operator: [operator],
        value: [],
        identifiers: [
          idenfiersOpt == ''
            ? this.rmTimeStamp(filter.name)
            : filter.identifiers,
        ],
        agregator: [filter.name != undefined ? filter.name : filter.column],
        type: [filter.type],
      };
    });
  }

  seedData() {
    this.identifierData();
    this.dataRepo();
    const chartData = {
      title: this.titulo,
      graphType: this.chartType.toLowerCase(),
      sql: this.sql,
      yAxisColumns: this.yAxisColumns,
      xAxisColumns: this.xAxisColumns,
      series: this.seriesData,
      filters: this.filtersData,
      group: this.groupData,
      order: this.order.length
        ? this.order.map((order) => this.rmTimeStamp(order.name))
        : this.xAxisValues,
      orderInfo: this.order.length ? this.orderInfo : [],
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    console.log(chartData);

    if (this.yaxis.length > 0 && this.xaxis.length > 0) {
      this.createChart(chartData);
    }
  }

  createChart(chartData: any) {
    console.log(chartData);
    this.chartsService.createCharts(this.headers, chartData).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Gráfico criado',
        });
        this.showPreviewButton = false;
        this.chartPreView(data);
        this.chartId = data.id;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível concluir esta ação',
        });
      },
    });
  }

  updateChart() {
    this.identifierData();
    this.dataRepo();
    const chartData = {
      title: this.titulo,
      graphType: this.chartType.toLowerCase(),
      sql: this.sql,
      yAxisColumns: this.yAxisColumns,
      xAxisColumns: this.xAxisColumns,
      series: this.seriesData,
      filters: this.filtersData,
      group: this.groupData,
      order: this.order.length
        ? this.order.map((order) => this.rmTimeStamp(order.name))
        : this.xAxisValues,
      orderInfo: this.order.length ? this.orderInfo : [],
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    console.log(chartData);

    if (this.chartId == null) {
      this.chartId = this.itemId;
    } else if (this.itemId == null) {
      this.chartId = this.chartId;
    }

    this.chartsService
      .updateCharts(this.headers, chartData, this.chartId)
      .subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Informações do gráfico atualizadas',
          });
          this.chartPreView(data);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível concluir esta ação',
          });
          console.log(err);
        },
      });
  }

  openModalCancel() {
    if (this.itemId != undefined) {
      this.returnToCreateView();
    } else {
      console.log(this.chartId);
      this.chartsService.deleteCharts(this.headers, this.chartId).subscribe({
        next: (data) => {
          console.log(data);
        },
      });
      setTimeout(() => {
        this.returnToCreateView();
      }, 120);
    }
  }

  chartPreView(data: any) {
    console.log(data);
    const uniqueCategories: any = Array.from(
      new Set(data.xAxisColumns[0].data)
    );

    const uniqueSubgroups = Array.from(new Set(data.series[0].data));

    const seriesData = uniqueSubgroups.map((subgrupo: any) => {
      const seriesValues: { name: string; y: any }[] = [];
      data.xAxisColumns[0].data.forEach((date: string, i: number) => {
        if (data.series[0].data[i] === subgrupo) {
          seriesValues.push({
            name: date,
            y: data.yAxisColumns[0].data[i],
          });
        }
      });
      return {
        type: data.graphType,
        name: subgrupo,
        height: '20%',
        data: seriesValues,
      };
    });
    this.chartConfig = {
      chart: {
        type: data.graphType,
      },
      title: {
        text: data.title,
        style: {
          fontSize: '14px',
        },
      },
      xAxis: {
        categories: uniqueCategories,
        title: {
          text: data.xAxisColumns[0].name[0],
        },
        labels: {
          style: {
            fontSize: '10px',
          },
        },
      },
      yAxis: {
        title: {
          text: data.yAxisColumns[0].name[0],
        },
        labels: {
          style: {
            fontSize: '10px',
          },
        },
      },
      legend: {
        maxHeight: 65,
        itemStyle: {
          fontSize: '12px',
        },
      },
      series: seriesData,
      tooltip: {
        shared: true,
      },
    };
  }

  selectChartButton(label: string, value: string) {
    this.selectedChartButton = label;
    this.chartType = value;
  }

  backScreen() {
    this.router.navigate(['/admin/dashboards']);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  loadChartEdit(id: any) {
    this.chartsService.getChartsById(id, this.headers).subscribe({
      next: (value) => {
        this.dataEditProcessor(value);
      },
    });
  }

  dataEditProcessor(value: any) {
    let type = (() => {
      switch (value.graphType) {
        case 'area':
          return 'Area';
        case 'bar':
          return 'Barra';
        case 'column':
          return 'Coluna';
        case 'line':
          return 'Linha';
        case 'pie':
          return 'Pizza';
        default:
          return 'Unknown';
      }
    })();
    const columnFilterNames = value.filters.map((filter: any) => {
      return {
        name: filter.agregator[0],
        type: filter.type[0],
        identifiers: filter.identifiers[0],
        value: filter.value[0],
        column: filter.column[0],
        agregator: filter.agregator[0],
      };
    });
    const yaxis = value.yAxisColumns.map((axis: any) => {
      console.log(axis);
      return {
        name: axis.agregator[0],
        identifiers: axis.name[0],
        value: axis.column[0],
        type: axis.type[0],
      };
    });
    const xaxis = value.xAxisColumns.map((axis: any) => {
      console.log(axis);
      return {
        name: axis.agregator[0],
        identifiers: axis.name[0],
        value: axis.column[0],
        type: axis.type[0],
      };
    });
    const series = value.series.map((axis: any) => {
      console.log(axis);
      return {
        name: axis.agregator[0],
        identifiers: axis.name[0],
        value: axis.column[0],
        type: axis.type[0],
      };
    });
    console.log(columnFilterNames);
    console.log(value);
    const id = value.id;
    this.titulo = value.title;
    this.chartType = value.graphType;
    this.selectedChartButton = type;
    this.sql = value.sql;
    this.order = value.orderInfo;
    this.yaxis = yaxis;
    this.xaxis = xaxis;
    this.series = series;
    this.filters = columnFilterNames;

    this.loadinitialEditChart(id);
  }

  loadinitialEditChart(id: any) {
    this.chartsService.getChartsById(id, this.headers).subscribe({
      next: (value) => {
        this.chartPreView(value);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  rmAgregateReplace(item: string) {
    return item.replace(/^(?:AVG|COUNT|SUM|mês)\(([^)]+)\)$/, '$1');
  }

  rmTimeStamp(item: string) {
    if (this.isTimestampField(item)) {
      return item.replace(/\((?:dia|mês|ano)\)/, '');
    }
    return item;
  }

  getDateFormat(fieldName: string): string {
    return `DATE_TRUNC('month', ${this.rmTimeStamp(fieldName)})`;
  }

  isTimestampField(fieldName: string): boolean {
    return (
      fieldName.includes('(dia)') ||
      fieldName.includes('(mês)') ||
      fieldName.includes('(ano)')
    );
  }

  formatTimestampField(axisName: string): string {
    if (axisName.includes('(dia)')) {
      return `DATE_TRUNC('day', ${this.rmTimeStamp(axisName)})`;
    } else if (axisName.includes('(mês)')) {
      return `DATE_TRUNC('month', ${this.rmTimeStamp(axisName)})`;
    } else if (axisName.includes('(ano)')) {
      return `ano_por_extenso(DATE_TRUNC('year', ${this.rmTimeStamp(
        axisName
      )}))`;
    }
    return this.rmTimeStamp(axisName);
  }
}
