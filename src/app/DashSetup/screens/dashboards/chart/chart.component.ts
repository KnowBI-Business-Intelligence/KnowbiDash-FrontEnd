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
import { StorageService } from '../../../../core/services/user/storage.service';
import { chartButtonsData } from './chartbuttons';
import { Subscription } from 'rxjs';
import { ChartgroupService } from '../../../../core/services/chartgroup/chartgroup.service';
import { DataService } from '../../../../core/services/dashboard/data.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

interface Axis {
  name: string;
  type: string;
  identifiers: string;
  value: '';
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
    SkeletonModule,
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
  xaxisShow: boolean = true;
  showPreviewButton: boolean = true;
  showModal: boolean = false;
  isDatabaseContent: boolean = true;
  isLoading: boolean = true;
  isEditing: boolean = false;
  modal: HTMLElement | undefined;
  selectedYAxis: Axis = { name: '', type: '', identifiers: '', value: '' };
  buildData: { name: any; identifiers: any }[] = [];
  yAxisValueWithoutAggregation: string = '';
  yaxisData: { [key: string]: string } = {};
  yaxisIdentifiers: { [key: string]: string } = {};
  Highcharts: typeof Highcharts = Highcharts;
  chart!: Highcharts.Chart;
  chartConfig: { [key: string]: Highcharts.Options } = {};
  charts: { [key: string]: Highcharts.Chart } = {};
  group: any;

  chartButtons = chartButtonsData;
  private user = this.storageService.getUser();
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private router: Router,
    private storageService: StorageService,
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
      const item = event.previousContainer.data[event.previousIndex] as any;
      if (
        (event.previousContainer.id === 'data-list' &&
          event.container.id === 'legend' &&
          item.type === 'numeric') ||
        (event.previousContainer.id === 'data-list' &&
          event.container.id === 'xaxis' &&
          item.type === 'numeric')
      ) {
        this.warnMessageToast(
          'Colunas do tipo "numeric" não pode ser inseridas em Legenda ou Eixo X - Rótulos.'
        );
        return;
      }

      if (
        event.previousContainer.id === 'data-list' &&
        event.container.id === 'yaxis' &&
        item.type !== 'numeric'
      ) {
        this.warnMessageToast(
          'Por favor, use apenas colunas do tipo numeric no campo Eixo y - Rótulos'
        );
        return;
      }

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
    if (this.database.length <= 0) {
      this.isDatabaseContent = false;
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
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
      let xAxisItem = this.xaxis[i].value;
      if (
        this.xaxis[i].type == 'timestamp' &&
        !this.isTimestampField(this.xaxis[i].name)
      ) {
        this.xaxis[i].value = `TO_CHAR(DATE_TRUNC('month', ${this.rmTimeStamp(
          this.xaxis[i].name
        )}), 'MM/YYYY')`;
        xAxisItem = this.xaxis[i].value;
      }
      const xAxisidentifiers = this.rmTimeStamp(this.xaxis[i].name);
      this.buildData.push({ name: xAxisItem, identifiers: xAxisidentifiers });
    }

    for (let i = 0; i < this.series.length; i++) {
      let seriesItem = this.series[i].value;
      if (
        this.series[i].type == 'timestamp' &&
        !this.isTimestampField(this.series[i].name)
      ) {
        this.series[i].value = `TO_CHAR(DATE_TRUNC('month', ${this.rmTimeStamp(
          this.series[i].name
        )}), 'MM/YYYY')`;
        seriesItem = this.series[i].value;
      }
      const seriesidentifiers = this.rmTimeStamp(this.series[i].name);
      this.buildData.push({ name: seriesItem, identifiers: seriesidentifiers });
    }

    this.sql = 'SELECT ';
    if (this.buildData.length > 0) {
      const selectClauses = this.buildData.map((item) => {
        return `${item.name} AS ${item.identifiers}`;
      });
      this.sql += selectClauses.join(', ');
    }

    if (this.buildData.length > 0) {
      this.sql += ` FROM ${this.tableName}`;
    }
  }

  dataRepo() {
    this.seriesValues = this.series.map((series) =>
      this.rmTimeStamp(series.value)
    );

    if (this.chartType != 'pie') {
      this.xAxisValues = this.xaxis.map((axis) => {
        if (this.isTimestampField(axis.name)) {
          return this.formatTimestampField(axis.name);
        }
        if (!this.isTimestampField(axis.name) && axis.type == 'timestamp') {
          return this.formatTimestampFieldWithoutAgrr(axis.name);
        }
        return this.rmTimeStamp(axis.name);
      });

      this.groupData = [...this.xAxisValues, ...this.seriesValues];
    } else {
      this.xAxisValues = [];
      this.groupData = [...this.seriesValues];
    }
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
    this.filtersData = this.filters.map((filter) => {
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
    const groupSelector =
      this.xAxisValues.length != 0
        ? [...this.seriesValues, ...this.xAxisValues]
        : this.seriesValues;

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
        : groupSelector,
      orderInfo: this.order.length ? this.orderInfo : [],
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    if (this.chartType != 'pie') {
      if (
        this.yaxis.length > 0 &&
        this.xaxis.length > 0 &&
        this.chartType != ''
      ) {
        this.isEditing = true;
        this.createChart(chartData);
      } else if (
        this.yaxis.length > 0 &&
        this.xaxis.length > 0 &&
        this.chartType == ''
      ) {
        this.warnMessageToast('Por favor, informe uma série base');
      } else {
        this.warnMessageToast('Por favor, preencha os campos obrigatórios');
      }
    } else {
      if (this.yaxis.length > 0 && this.series.length > 0) {
        this.isEditing = true;
        this.createChart(chartData);
      } else {
        this.warnMessageToast('Por favor, preencha os campos obrigatórios');
      }
    }
  }

  createChart(chartData: any) {
    console.log(JSON.stringify(chartData, null, 2));
    this.chartsService.createCharts(this.headers, chartData).subscribe({
      next: (data) => {
        this.showPreviewButton = false;
        this.isEditing = false;
        this.chartPreView(data);
        this.chartId = data.id;
      },
      error: (err) => {
        this.errorMessageToast('Não foi possível concluir esta ação');
      },
    });
  }

  updateChart() {
    this.identifierData();
    this.dataRepo();
    const groupSelector =
      this.xAxisValues.length != 0
        ? [...this.seriesValues, ...this.xAxisValues]
        : this.seriesValues;
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
        : groupSelector,
      orderInfo: this.order.length ? this.orderInfo : [],
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    this.chartConfig = {};

    if (this.chartId == null) {
      this.chartId = this.itemId;
    } else if (this.itemId == null) {
      this.chartId = this.chartId;
    }

    if (this.chartType != 'pie') {
      if (
        this.yaxis.length > 0 &&
        this.xaxis.length > 0 &&
        this.chartType != ''
      ) {
        this.isEditing = true;
        this.updateChartData(chartData);
      } else if (
        this.yaxis.length > 0 &&
        this.xaxis.length > 0 &&
        this.chartType == ''
      ) {
        this.warnMessageToast('Por favor, informe uma série base');
      } else {
        this.warnMessageToast('Por favor, preencha os campos obrigatórios');
      }
    } else {
      if (this.yaxis.length > 0 && this.series.length > 0) {
        this.isEditing = true;
        this.updateChartData(chartData);
      } else {
        this.warnMessageToast('Por favor, preencha os campos obrigatórios');
      }
    }
  }

  updateChartData(chartData: any) {
    console.log(JSON.stringify(chartData, null, 2));
    console.log(this.chartId);
    this.chartsService
      .updateCharts(this.headers, chartData, this.chartId)
      .subscribe({
        next: (data) => {
          this.chartPreView(data);
          this.isEditing = false;
        },
        error: (err) => {
          this.errorMessageToast('Não foi possível concluir esta ação');
        },
      });
  }

  openModalCancel() {
    if (this.itemId != undefined) {
      this.returnToCreateView();
    } else {
      this.chartsService.deleteCharts(this.headers, this.chartId).subscribe({
        next: (data) => {},
      });
      setTimeout(() => {
        this.returnToCreateView();
      }, 120);
    }
  }

  chartPreView(data: any) {
    const categories: string[] =
      data.xAxisColumns.length > 0
        ? Array.from(new Set(data.xAxisColumns[0].data))
        : [];
    const yAxisData: number[] = data.yAxisColumns[0].data;

    let highchartsSeries: Highcharts.SeriesColumnOptions[] = [];

    if (data.series.length === 0) {
      highchartsSeries = [
        {
          type: data.graphType,
          name: 'Dados',
          data: yAxisData,
        },
      ];
    } else {
      const seriesCategories: string[] = data.series[0].data;
      const seriesData: { [key: string]: { [category: string]: number } } = {};

      for (let i = 0; i < seriesCategories.length; i++) {
        const seriesCategory = seriesCategories[i];
        const category =
          data.xAxisColumns.length > 0 ? data.xAxisColumns[0].data[i] : [];
        const value = yAxisData[i];

        if (!seriesData[seriesCategory]) {
          seriesData[seriesCategory] = {};
        }
        if (!seriesData[seriesCategory][category]) {
          seriesData[seriesCategory][category] = 0;
        }
        seriesData[seriesCategory][category] += value;
      }

      for (const seriesCategory in seriesData) {
        if (seriesData.hasOwnProperty(seriesCategory)) {
          const dataset: number[] = categories.map(
            (category) => seriesData[seriesCategory][category] || 0
          );
          const pieData = data.yAxisColumns[0].data.map(
            (y: number, index: number) => ({
              name: data.series[0].data[index],
              y: y,
            })
          );
          if (data.graphType === 'pie') {
            highchartsSeries.push({
              type: data.graphType,
              name: data.series[0].name,
              colorByPoint: true,
              data: pieData,
            });
          } else {
            highchartsSeries.push({
              type: data.graphType,
              name: seriesCategory,
              data: dataset,
            });
          }
        }
      }
    }

    if (!this.charts) {
      this.charts = {};
    }

    if (this.charts[data.id]) {
      const chart = this.charts[data.id];
      while (chart.series.length > 0) {
        chart.series[0].remove(true);
      }
      highchartsSeries.forEach((series) => {
        chart.addSeries(series, false);
      });
      chart.xAxis[0].setCategories(categories, false);
      chart.update(
        {
          title: {
            text: data.title,
          },
          chart: {
            type: data.graphType,
          },
          xAxis:
            data.graphType === 'pie'
              ? undefined
              : {
                  title: {
                    text: data.xAxisColumns[0].name[0],
                  },
                },
          yAxis:
            data.graphType === 'pie'
              ? undefined
              : {
                  title: {
                    text: data.yAxisColumns[0].name[0],
                  },
                },
          series: highchartsSeries,
        },
        true
      );
      chart.redraw();
    } else {
      this.chartConfig[data.id] = {
        chart: {
          type: data.graphType,
        },
        title: {
          text: data.title,
          align: 'center',
          style: {
            fontSize: '13px',
            fontWeight: '450',
          },
        },
        xAxis:
          data.graphType === 'pie'
            ? undefined
            : {
                categories: categories,
                crosshair: true,
                accessibility: {
                  description: 'Categories',
                },
                title: {
                  text: data.xAxisColumns[0].name[0],
                  style: {
                    fontSize: '11px',
                  },
                },
                labels: {
                  style: {
                    fontSize: '10px',
                  },
                },
              },
        yAxis:
          data.graphType === 'pie'
            ? undefined
            : {
                min: 0,
                title: {
                  text: data.yAxisColumns[0].name[0],
                  style: {
                    fontSize: '11px',
                  },
                },
                labels: {
                  style: {
                    fontSize: '10px',
                  },
                },
              },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '10px',
                fontWeight: '400',
              },
            },
          },
          bar: {
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '10px',
                fontWeight: '400',
              },
            },
            groupPadding: 0.1,
          },
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 5,
            dataLabels: {
              enabled: true,
              format: '<b">{point.name}</b><br>{point.percentage:.1f} %',
              style: {
                fontSize: '12px',
                fontWeight: '400',
              },
            },
          },
          area: {
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '10px',
                fontWeight: '400',
              },
            },
          },
          line: {
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '10px',
                fontWeight: '400',
              },
            },
          },
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function () {
                  //console.log('Coluna clicada:', this.category, this.y);
                },
              },
            },
          },
        },
        series: highchartsSeries,
        legend: {
          maxHeight: 65,
          itemStyle: {
            fontSize: '10px',
          },
        },
      };
    }
  }

  chartKeys() {
    return Object.keys(this.chartConfig);
  }

  selectChartButton(label: string, value: string) {
    if (value == 'pie') {
      this.xaxisShow = false;
      this.xaxis = [];
    } else {
      this.xaxisShow = true;
    }
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
      return {
        name: axis.agregator[0],
        identifiers: axis.name[0],
        value: axis.column[0],
        type: axis.type[0],
      };
    });
    const xaxis = value.xAxisColumns.map((axis: any) => {
      return {
        name: axis.agregator[0],
        identifiers: axis.name[0],
        value: this.returnValueEdit(axis),
        type: axis.type[0],
      };
    });
    const series = value.series.map((axis: any) => {
      return {
        name: axis.agregator[0],
        identifiers: axis.name[0],
        value: axis.column[0],
        type: this.returnValueEdit(axis),
      };
    });
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

    console.log(this.yaxis);
    console.log(this.xaxis);
    console.log(this.series);

    if (value.graphType == 'pie') {
      this.xaxisShow = false;
    }

    this.loadinitialEditChart(id);
  }

  returnValueEdit(data: any) {
    const agregator = data.agregator[0].trim();
    if (data.type[0] === 'timestamp') {
      if (agregator.includes('(dia)')) {
        return `DATE_TRUNC('day', ${this.rmTimeStamp(data.column[0])})`;
      } else if (agregator.includes('(mês)')) {
        return `mes_por_extenso(DATE_TRUNC('month', ${this.rmTimeStamp(
          data.column[0]
        )}))`;
      } else if (agregator.includes('(ano)')) {
        return `ano_por_extenso(DATE_TRUNC('year', ${this.rmTimeStamp(
          data.column[0]
        )}))`;
      }
    }

    return data.column[0];
  }

  loadinitialEditChart(id: any) {
    this.chartsService.getChartsById(id, this.headers).subscribe({
      next: (value) => {
        this.chartPreView(value);
      },
      error(err) {},
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

  formatTimestampFieldWithoutAgrr(axisName: string): string {
    return `DATE_TRUNC('month', ${this.rmTimeStamp(axisName)})`;
  }

  errorMessageToast(message: string) {
    return this.messageService.add({
      severity: 'error',
      detail: message,
    });
  }

  warnMessageToast(message: string) {
    return this.messageService.add({
      severity: 'warn',
      detail: message,
    });
  }

  successMessageToast(message: string) {
    return this.messageService.add({
      severity: 'success',
      detail: message,
    });
  }
}
