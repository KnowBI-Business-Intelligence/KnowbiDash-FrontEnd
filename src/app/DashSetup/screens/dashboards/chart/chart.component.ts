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
  private user = this.storageService.getUser();
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private router: Router,
    private storageService: StorageService,
    private localStorageService: LocalstorageService,
    private chartsService: ChartsService,
    private chartGroupService: ChartgroupService
  ) {}

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
    this.startDashboarData();
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
            value = `mes_por_extenso(DATE_TRUNC('month', ${this.rmTimeStamp(
              setData.name
            )}))`;
          } else if (part === '(ano)') {
            value = `ano_por_extenso(DATE_TRUNC('year', ${this.rmTimeStamp(
              setData.name
            )}))`;
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
            identifier: this.selectedYAxis.identifier
              ? this.selectedYAxis.identifier
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

  dataRepo() {
    this.xAxisValues = this.xaxis.map((axis) => {
      if (this.isTimestampField(axis.name)) {
        return this.formatTimestampField(axis.name);
      }
      return this.rmTimeStamp(axis.name);
    });

    this.seriesValues = this.series.map((series) =>
      this.rmTimeStamp(series.value)
    );

    this.groupData = [...this.xAxisValues, ...this.seriesValues];

    this.yAxisColumns = this.yaxis.map((axis) => {
      return {
        name: [this.rmTimeStamp(axis.value)],
        identifiers: [axis.identifier],
      };
    });

    this.xAxisColumns = this.xaxis.map((axis) => {
      return {
        name: [this.rmTimeStamp(axis.name)],
        identifiers: [axis.identifier],
      };
    });

    this.seriesData = this.series.map((series) => {
      return {
        name: [this.rmTimeStamp(series.name)],
        identifiers: [series.identifier],
      };
    });

    this.filtersData = this.filters.map((filter) => {
      let operator;
      if (filter.type === 'timestamp' || filter.type === 'numeric') {
        operator = 'BETWEEN';
      } else {
        operator = 'IN';
      }

      if (filter.type === 'numeric') {
        filter.identifiers = this.rmTimeStamp(filter.name);
      } else {
        filter.identifiers = filter.identifier;
      }

      return {
        column: [this.rmTimeStamp(filter.name)],
        operator: [operator],
        value: [],
        identifiers: [filter.identifier],
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
      chartGroup: {
        id: this.dashBoard.id,
      },
    };
    if (this.yaxis.length > 0 && this.xaxis.length > 0) {
      this.createChart(chartData);
    }
  }

  createChart(chartData: any) {
    console.log(chartData);
    this.chartsService.createCharts(this.headers, chartData).subscribe({
      next: (data) => {
        this.showPreviewButton = false;
        this.chartPreView(data);
        this.chartId = data.id;
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
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    console.log(chartData);

    this.chartsService
      .updateCharts(this.headers, chartData, this.chartId)
      .subscribe({
        next: (data) => {
          this.chartPreView(data);
        },
      });
  }

  openModalCancel() {
    console.log(this.chartId);
    this.chartsService.deleteCharts(this.headers, this.chartId).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
    this.returnToCreateView();
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

  rmAgregateReplace(item: string) {
    return item.replace(/^(?:AVG|COUNT|SUM|mês)\(([^)]+)\)$/, '$1');
  }

  rmTimeStamp(item: string) {
    return item.replace(/\((?:dia|mês|ano)\)/, '');
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
