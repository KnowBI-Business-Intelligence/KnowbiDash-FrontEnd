import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/user/storage.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkMenu,
  CdkMenuGroup,
  CdkMenuItem,
  CdkMenuItemCheckbox,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  faDatabase,
  faGear,
  faXmark,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import { ChartgroupService } from '../../../../core/services/chartgroup/chartgroup.service';
import { Subscription } from 'rxjs';

interface Axis {
  name: string;
  type: string;
  identifier: string;
  value: '';
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItemCheckbox,
    CdkMenuGroup,
    CdkMenuItem,
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit, OnDestroy {
  @Output() returnToCreate = new EventEmitter<void>();
  private encryptedDataSubscription: Subscription | undefined;
  icons = {
    database: faDatabase,
    close: faXmark,
    code: faCode,
    edit: faGear,
  };

  cardTitle: string = '';
  prefix: string = '';
  sufix: string = '';
  cardData: any = 1500;

  dashBoard: any;
  chartId: any;
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

  user = this.storageService.getUser();
  constructor(
    private router: Router,
    private storageService: StorageService,
    private localStorageService: LocalstorageService,
    private chartsService: ChartsService,
    private chartGroupService: ChartgroupService
  ) {}

  database: any[] = [];
  yaxis: any[] = [];
  filters: any[] = [];

  ngOnInit(): void {
    this.dashBoard =
      this.localStorageService.getDecryptedItem('chartGroupview');
    this.loadDataView(this.dashBoard.id);
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
  returnToCreateView(): void {
    this.chartGroupService.setCurrentView('ViewCreateComponent');
  }

  startDashboarData() {
    this.encryptedDataSubscription =
      this.chartGroupService.encryptedData$.subscribe((encryptedData) => {
        this.dashBoard = encryptedData;
      });
  }

  ngOnDestroy() {
    if (this.encryptedDataSubscription) {
      this.encryptedDataSubscription.unsubscribe();
    }
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
      case 'filters':
        this.filters.splice(index, 1);
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
    this.identifierData();
    this.showPreviewButton = false;
    const cardData = {
      title: this.cardTitle,
      prefix: this.prefix,
      sufix: this.sufix,
      sql: this.sql,
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
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    console.log(cardData);
    this.createCard(cardData);
  }

  createCard(chartData: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.createCards(headers, chartData).subscribe({
      next: (data) => {
        this.cardPreView(data);
        this.chartId = data.id;
        this.updateChart();
      },
    });
  }

  updateChart() {
    this.identifierData();
    this.showPreviewButton = false;
    const cardData = {
      title: this.cardTitle,
      prefix: this.prefix,
      sufix: this.sufix,
      sql: this.sql,
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
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.updateCards(headers, cardData, this.chartId).subscribe({
      next: (data) => {
        this.cardPreView(data);
      },
    });
  }

  cardPreView(data: any) {
    let result = null;
    if (typeof data.result === 'number') {
      result = this.formatterResultWhenDecimal(data.result);
    } else {
      result = data.result;
    }
    console.log(result);
    this.cardTitle = data.title;
    this.cardData = data.prefix + '' + result + ' ' + data.sufix;
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

  openModalCancel() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });
    this.chartsService.deleteCards(headers, this.chartId).subscribe({
      next: (data) => {
        console.log(data);
      },
    });

    this.returnToCreateView();
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
