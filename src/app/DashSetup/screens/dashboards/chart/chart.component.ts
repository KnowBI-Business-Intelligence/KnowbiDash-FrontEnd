import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faDatabase, faXmark, faGear } from '@fortawesome/free-solid-svg-icons';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  copyArrayItem,
} from '@angular/cdk/drag-drop';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuGroup,
  CdkMenuItemCheckbox,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../../../services/service/user/storage.service';
import { ChartsService } from '../../../../services/service/charts/charts.service';
import { chartButtonsData } from './chartbuttons';
import { CommonModule } from '@angular/common';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';
import { LocalstorageService } from '../../../../services/service/localstorage/localstorage.service';

interface Axis {
  name: string;
  type: string;
  identifier: string;
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

  titulo: string = '';
  chartType: string = '';
  sql: string = 'SELECT ';
  tableName: string = '';

  selectedYAxis: Axis = { name: '', type: '', identifier: '' };
  buildData: { name: any; identifier: any }[] = [];
  yAxisValueWithoutAggregation: string = '';
  yaxisData: { [key: string]: string } = {};
  yaxisIdentifiers: { [key: string]: string } = {};
  identifier: string = '';
  selectedAggregation: string = '';

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
    const data = this.localStorageService.getDecryptedItem('chartGroupview');
    this.loadDataView(data.id);
    this.chartPreView();
  }

  selectChartButton(label: string) {
    this.chartType = label;
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

  extractValue(aggregation: string) {
    if (this.selectedYAxis) {
      const yAxisName = this.selectedYAxis.name;
      const columnNameRegex = /^(?:AVG|COUNT|SUM)\(([^)]+)\)$/;

      if (columnNameRegex.test(yAxisName)) {
        const columnName = yAxisName.replace(columnNameRegex, '$1');
        const newAggregationValue = aggregation + '(' + columnName + ')';
        console.log(this.selectedYAxis);
        const updatedAxis = {
          name: newAggregationValue,
          identifier: this.selectedYAxis.identifier
            ? this.selectedYAxis.identifier
            : this.selectedYAxis.name,
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
          };
        }
      }
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

  editSave() {
    if (this.selectedYAxis) {
      this.selectedYAxis.identifier = this.identifier
        ? this.identifier
        : this.selectedYAxis.name;
      this.yaxisIdentifiers[this.selectedYAxis.name] =
        this.selectedYAxis.identifier;
    }
  }

  processData(data: any) {
    data.columns.forEach((setData: any) => {
      this.database.push(setData);
      this.yaxisData[setData.name] = setData;
      if (!setData.identifier || setData.identifier.trim() === '') {
        setData.identifier = setData.name;
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

  identifierData() {
    this.buildData = [];
    for (let i = 0; i < this.yaxis.length; i++) {
      const yAxisItem = this.yaxis[i].name;
      let identifierItem = yAxisItem;
      console.log(identifierItem);
      const hasAggregation = /^(?:AVG|COUNT|SUM)\([^)]+\)$/.test(
        identifierItem
      );
      if (hasAggregation) {
        identifierItem = identifierItem.replace(
          /^(?:AVG|COUNT|SUM)\(([^)]+)\)$/,
          '$1'
        );
      }

      this.buildData.push({ name: yAxisItem, identifier: identifierItem });
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

    console.log(this.sql);
  }

  seedData() {
    console.log('Título:', this.titulo);
    console.log('Tipo:', this.chartType.toLowerCase());
    this.yaxis.forEach((axis) => {
      console.log(`Eixo y ${axis.name}: ${axis.identifier}`);
    });
    this.xaxis.forEach((axis) => {
      console.log(`Eixo x ${axis.name}: ${axis.identifier}`);
    });
    this.series.forEach((series) => {
      console.log(`Series ${series.name}: ${series.identifier}`);
    });
    this.filters.forEach((filter) => {
      console.log(`filters ${filter.name}: ${filter.identifier}`);
    });
    this.groupment.forEach((group) => {
      console.log(`group ${group.name}: ${group.identifier}`);
    });
    this.order.forEach((order) => {
      console.log(`order ${order.name}: ${order.identifier}`);
    });
  }

  chartPreView() {
    this.identifierData();
    this.seedData();
    this.chartConfig = {
      chart: {
        type: 'column',
      },
      title: {
        text: this.titulo,
        style: {
          fontSize: '14px',
        },
      },
      xAxis: {
        categories: ['UNIMED', 'CASF', 'Bradesco', 'CASSI'],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Atendimentos',
        },
      },
      series: [
        {
          type: 'column',
          name: 'consulta',
          data: [631, 727, 3202, 721],
        },
        {
          type: 'column',
          name: 'Quimioterapia',
          data: [814, 841, 3714, 726],
        },
      ],
    };
  }
  backScreen() {
    this.router.navigate(['/admin/dashboards']);
  }

  agregateReplace(item: string) {
    return item.replace(/^(?:AVG|COUNT|SUM)\(([^)]+)\)$/, '$1');
  }
}
