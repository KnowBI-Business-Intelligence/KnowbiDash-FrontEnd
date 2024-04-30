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
  selectedYAxis: string = '';
  yAxisValueWithoutAggregation: string = '';
  yaxisData: { [key: string]: string } = {};
  identifier: string = '';
  titulo: string = '';
  selectedAggregation: string = '';
  Highcharts: typeof Highcharts = Highcharts;
  chartConfig!: ExtendedOptions;
  group: any;
  icons = {
    database: faDatabase,
    close: faXmark,
    edit: faGear,
  };
  chartButtons = chartButtonsData;
  user = this.storageService.getUser();
  constructor(
    private router: Router,
    private storageService: StorageService,
    private localStorageService: LocalstorageService,
    private chartsService: ChartsService
  ) {}

  database: string[] = [];
  yaxis: string[] = [];
  xaxis: string[] = [];
  series: string[] = [];
  filters: string[] = [];
  groupment: string[] = [];
  order: string[] = [];

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

  YAxisValue(item: string) {
    if (!this.yaxisData[item]) {
      this.yaxisData[item] = item;
    }

    this.identifier = this.yaxisData[item];
  }

  extractValue(aggregation: string) {
    if (this.selectedYAxis) {
      this.yAxisValueWithoutAggregation = this.selectedYAxis.replace(
        /^(?:AVG|COUNT|SUM)\(([^)]+)\)$/,
        '$1'
      );
      const aggregationValue =
        aggregation + '(' + this.yAxisValueWithoutAggregation + ')';
      const index = this.yaxis.indexOf(this.selectedYAxis);
      if (index !== -1) {
        this.yaxis[index] = aggregationValue;
      }
    }
  }

  loadDataView(id: string) {
    console.log(id);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.getChartGroup(headers).subscribe({
      next: (data) => {
        data.forEach((getId: any) => {
          if (id == getId.id) {
            this.processData(getId);
          }
        });
      },
    });
  }

  openMenu(index: number) {
    this.selectedYAxis = this.yaxis[index];
    this.identifier = this.yaxisData[this.selectedYAxis];
  }

  editSave(index: number) {}

  processData(data: any) {
    data.columns.forEach((setData: any) => {
      this.database.push(setData);
      this.yaxisData[setData] = setData;
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
    const yAxisData = [];
    for (let i = 0; i < this.yaxis.length; i++) {
      const yAxisItem = this.yaxis[i];
      let identifierItem = this.yaxisData[yAxisItem];

      if (!identifierItem) {
        identifierItem = yAxisItem;
      } else {
        const hasAggregation = /^(?:AVG|COUNT|SUM)\([^)]+\)$/.test(
          identifierItem
        );
        if (hasAggregation) {
          identifierItem =
            yAxisItem +
            identifierItem.replace(/^(?:AVG|COUNT|SUM)\(([^)]+)\)$/, '$1');
        }
      }

      yAxisData.push({ name: yAxisItem, identifier: identifierItem });
    }
    console.log(yAxisData);
  }

  chartPreView() {
    this.identifierData();
    console.log('Título:', this.titulo);
    console.log('eixo y ', this.yaxis);
    console.log('eixo x ', this.xaxis);
    console.log('series ', this.series);
    console.log('filters ', this.filters);
    console.log('group ', this.groupment);
    console.log('order ', this.order);
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
}
