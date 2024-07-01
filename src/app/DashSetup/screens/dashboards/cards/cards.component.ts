import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DataService } from '../../../../core/services/dashboard/data.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

interface Axis {
  name: string;
  type: string;
  identifiers: string;
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
    ToastModule,
    SkeletonModule,
  ],
  templateUrl: './cards.component.html',
  styleUrls: [
    './cards.component.css',
    '../../../../core/globalStyle/toast.css',
  ],
})
export class CardsComponent implements OnInit, OnDestroy {
  @Output() returnToCreate = new EventEmitter<void>();
  icons = {
    database: faDatabase,
    close: faXmark,
    code: faCode,
    edit: faGear,
  };

  private encryptedDataSubscription: Subscription | undefined;
  database: any[] = [];
  yaxis: any[] = [];
  filters: any[] = [];
  cardData: any;
  dashBoard: any;
  cardId: any;
  layoutId: any;
  itemId: any;
  cardTitle: string = '';
  prefix: string = '';
  sufix: string = '';
  sql: string = 'SELECT ';
  tableName: string = '';
  identifiers: string = '';
  selectedAggregation: string = '';
  selectedChartButton: string = '';
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

  private user = this.storageService.getUser();
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private storageService: StorageService,
    private chartsService: ChartsService,
    private chartGroupService: ChartgroupService,
    private dataService: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.startDashboarData();
  }

  ngOnDestroy() {
    if (this.encryptedDataSubscription) {
      this.encryptedDataSubscription.unsubscribe();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.container.id === 'yaxis' && event.container.data.length >= 1) {
        return;
      }
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.container.id === 'yaxis' && event.container.data.length > 1) {
        event.container.data.splice(1);
      }
    }
  }

  returnToCreateView(): void {
    this.chartGroupService.setCurrentView('ViewCreateComponent');
  }

  startDashboarData() {
    this.encryptedDataSubscription =
      this.chartGroupService.encryptedData$.subscribe((encryptedData) => {
        this.dashBoard = encryptedData;
        this.loadDataView(this.dashBoard.id);
      });
  }

  startEditData() {
    const data = this.dataService.getData();
    this.itemId = data.itemId;
    if (this.itemId != undefined) {
      this.showPreviewButton = false;
      this.loadCardEdit(this.itemId);
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

  clearData(): void {
    this.yaxis = [];
  }

  clearFilterData(): void {
    this.filters = [];
  }

  processData(data: any) {
    this.database = [];
    this.clearFilterData();
    this.clearData();
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
            agregator: name != undefined ? name : setData.column,
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
    console.log(this.yaxis);
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
      const yAxisidentifier = this.yaxis[i].value;
      let identifierItem = yAxisidentifier;
      const hasAggregation = /^(?:AVG|COUNT|SUM)\([^)]+\)$/.test(
        identifierItem
      );
      if (hasAggregation) {
        identifierItem = this.rmAgregateReplace(identifierItem);
      }

      this.buildData.push({ name: yAxisItem, identifiers: identifierItem });
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

  seedData() {
    this.identifierData();
    const cardData = {
      title: this.cardTitle,
      prefix: this.prefix,
      sufix: this.sufix,
      column: this.yaxis,
      sql: this.sql,
      filters: this.filters.map((filter) => {
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
      }),
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    if (this.yaxis.length > 0) {
      this.createCard(cardData);
      this.isEditing = true;
    } else {
      this.messageService.add({
        severity: 'warn',
        detail: 'Por favor, preencha os campos obrigatórios',
      });
    }
  }

  createCard(cardData: any) {
    this.chartsService.createCards(this.headers, cardData).subscribe({
      next: (data) => {
        this.isEditing = false;
        this.showPreviewButton = false;
        this.cardPreView(data);
        this.cardId = data.id;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          detail:
            'Não foi possível concluir esta ação, verifique o operador da coluna',
        });
      },
    });
  }

  updateChart() {
    if (this.yaxis.length > 0) {
      this.isEditing = true;
      this.identifierData();
      this.showPreviewButton = false;
      const cardData = {
        title: this.cardTitle,
        prefix: this.prefix,
        sufix: this.sufix,
        column: this.yaxis,
        sql: this.sql,
        filters: this.filters.map((filter) => {
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
            agregator: [filter.name != undefined ? filter.name : filter.column],
            identifiers: [
              idenfiersOpt == ''
                ? this.rmTimeStamp(filter.name)
                : filter.identifiers,
            ],
          };
        }),
        chartGroup: {
          id: this.dashBoard.id,
        },
      };

      if (this.cardId == null) {
        this.cardId = this.itemId;
      } else if (this.itemId == null) {
        this.cardId = this.cardId;
      }
      this.updateCardData(cardData);
    } else {
      this.messageService.add({
        severity: 'warn',
        detail: 'Por favor, preencha os campos obrigatórios',
      });
    }
  }

  updateCardData(cardData: any) {
    this.chartsService
      .updateCards(this.headers, cardData, Number(this.cardId))
      .subscribe({
        next: (data) => {
          this.isEditing = false;
          this.cardPreView(data);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            detail: 'Não foi possível concluir esta ação',
          });
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
    if (this.itemId != undefined) {
      this.returnToCreateView();
    } else {
      this.chartsService.deleteCards(this.headers, this.cardId).subscribe({
        next: (data) => {},
      });
      setTimeout(() => {
        this.returnToCreateView();
      }, 120);
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  loadCardEdit(id: any) {
    this.chartsService.getCardsById(id, this.headers).subscribe({
      next: (value) => {
        const columnNames = value.filters.map((filter: any) => {
          console.log(filter);
          return {
            name: filter.agregator[0],
            type: filter.type[0],
            identifiers: filter.identifiers[0],
            value: filter.value[0],
            column: filter.column[0],
            agregator: filter.agregator[0],
          };
        });
        const result = this.formatterResultWhenDecimal(value.result);
        this.cardTitle = value.title;
        this.cardData = value.prefix + '' + result + ' ' + value.sufix;
        this.yaxis = value.column;
        this.sql = value.sql;
        this.prefix = value.prefix;
        this.sufix = value.sufix;
        this.filters = columnNames;
      },
      error: (err) => {},
    });
  }

  rmAgregateReplace(item: string) {
    return item.replace(/^(?:AVG|COUNT|SUM|mês)\(([^)]+)\)$/, '$1');
  }

  rmTimeStamp(item: string): string {
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
