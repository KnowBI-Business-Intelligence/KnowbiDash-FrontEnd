import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Axis, PeriodicElement } from '../../../../core/modules/interfaces';
import { TableModule } from 'primeng/table';
import { DataService } from '../../../../core/services/dashboard/data.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-table',
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
    TableModule,
    ToastModule,
  ],
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.css',
    '../../../../core/globalStyle/toast.css',
  ],
})
export class TableComponent implements OnInit {
  icons = {
    database: faDatabase,
    close: faXmark,
    code: faCode,
    edit: faGear,
  };
  private encryptedDataSubscription: Subscription | undefined;
  private groupData: any[] = [];
  private filtersData: any[] = [];
  private tableData: any[] = [];
  database: any[] = [];
  tabledata: any[] = [];
  filters: any[] = [];
  showTableColumns: any[] = [];
  showTableData: any[] = [];

  displayedColumns: string[] = [];
  selectedRow: PeriodicElement | null = null;

  selectedChartButton: string = '';
  tableTitle: string = '';
  chartType: string = '';
  selectedTab: string = '---';
  sql: string = 'SELECT ';
  tableName: string = '';
  identifiers: string = '';
  selectedAggregation: string = '';

  dashBoard: any;
  tableId: any;
  itemId: any;

  showPreviewButton: boolean = true;
  showModal: boolean = false;

  modal: HTMLElement | undefined;
  selectedtabledata: Axis = { name: '', type: '', identifiers: '', value: '' };
  buildData: { name: any; identifiers: any }[] = [];
  sortDescriptions: { [key: string]: string } = {};
  tabledataValueWithoutAggregation: string = '';
  tabledataData: { [key: string]: string } = {};
  tabledataidentifiers: { [key: string]: string } = {};
  private user = this.storageService.getUser();
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
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
        this.loadDataView(this.dashBoard.id);
      });
  }

  startEditData() {
    const data = this.dataService.getData();
    this.itemId = data.itemId;
    if (this.itemId != undefined) {
      this.showPreviewButton = false;
      this.loadTableEdit(this.itemId);
    }
  }

  openMenu(index: number, item: any) {
    this.selectedtabledata = item;
    this.tabledata[index].identifiers = this.identifiers;
  }

  AxisValue(item: any) {
    this.selectedtabledata = item;
    if (this.identifiers == '' || this.identifiers == undefined) {
      this.identifiers = this.selectedtabledata.name;
    } else {
      this.identifiers = this.selectedtabledata.identifiers;
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

  clearTableData(): void {
    this.tabledata = [];
  }

  clearFilterData(): void {
    this.filters = [];
  }

  processData(data: any) {
    this.database = [];
    this.clearFilterData();
    this.clearTableData();
    this.startEditData();
    data.columns.forEach((setData: any) => {
      this.database.push(setData);
      this.tabledataData[setData.name] = setData;
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
            type: setData.type,
            identifiers: this.rmTimeStamp(identifiers),
            value: value,
            agregator: name != undefined ? name : setData.column,
          };
          this.database.push(timestampPart);
        });
      }
    });
  }

  removeItem(list: string, index: number) {
    switch (list) {
      case 'tabledata':
        this.tabledata.splice(index, 1);
        break;
      case 'filters':
        this.filters.splice(index, 1);
        break;
      default:
        break;
    }
  }

  extractValue(aggregation: string) {
    if (this.selectedtabledata) {
      const tabledataName = this.selectedtabledata.name;
      const columnNameRegex = /^(?:AVG|COUNT|SUM)\(([^)]+)\)$/;
      let columnName;

      if (columnNameRegex.test(tabledataName)) {
        columnName = tabledataName.replace(columnNameRegex, '$1');
      } else {
        columnName = tabledataName;
      }

      let newAggregationValue = aggregation + '(' + columnName + ')';

      const updatedAxis = {
        name: newAggregationValue,
        identifiers: this.selectedtabledata.identifiers
          ? this.selectedtabledata.identifiers
          : this.selectedtabledata.name,
        type: this.selectedtabledata.type,
        value: columnName,
      };

      const index = this.tabledata.findIndex(
        (item) => item.name === tabledataName
      );
      if (index !== -1) {
        this.tabledata[index] = updatedAxis;
      } else {
        this.tabledata.push(updatedAxis);
      }
    }
  }

  editSave() {
    if (this.selectedtabledata) {
      this.selectedtabledata.identifiers = this.identifiers
        ? this.identifiers
        : this.selectedtabledata.name;
      this.tabledataidentifiers[this.selectedtabledata.name] =
        this.selectedtabledata.identifiers;
    }
  }

  identifiersData() {
    this.buildData = [];
    for (let i = 0; i < this.tabledata.length; i++) {
      const tabledataItem = this.tabledata[i].name;
      const tabledataidentifiers = this.tabledata[i].value;
      let identifiersItem = tabledataidentifiers;
      const hasAggregation = /^(?:AVG|COUNT|SUM)\([^)]+\)$/.test(
        identifiersItem
      );
      if (hasAggregation) {
        identifiersItem = this.rmAgregateReplace(identifiersItem);
      }
      if (this.tabledata[i].type == 'timestamp') {
        this.buildData.push({
          name: identifiersItem,
          identifiers: this.rmTimeStamp(tabledataItem),
        });
      } else {
        this.buildData.push({
          name: tabledataItem,
          identifiers: identifiersItem,
        });
      }
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
    this.groupData = this.tabledata
      .map((data) => {
        if (data.type !== 'numeric') {
          if (this.isTimestampField(data.name)) {
            return this.formatTimestampField(data.name);
          }
          return this.rmTimeStamp(data.name);
        }
        return null;
      })
      .filter((value) => value !== null);

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
      };
    });

    this.tableData = this.tabledata.map((axis) => {
      if (axis.type == 'numeric') {
        return {
          name: [this.rmAgregateReplace(axis.name)],
          identifiers: [axis.identifiers],
          agregator: [axis.agregator != null ? axis.agregator : axis.name],
          type: [axis.type],
        };
      } else if (axis.type == 'timestamp') {
        return {
          name: [this.rmTimeStamp(axis.name)],
          identifiers: [axis.identifiers],
          agregator: [axis.agregator != null ? axis.agregator : axis.name],
          type: [axis.type],
        };
      }
      return {
        name: [axis.name],
        identifiers: [axis.identifiers],
        agregator: [axis.agregator != null ? axis.agregator : axis.name],
        type: [axis.type],
      };
    });
  }

  seedData() {
    this.identifiersData();
    this.dataRepo();
    const tableData = {
      title: this.tableTitle,
      sql: this.sql,
      tableData: this.tableData,
      filters: this.filtersData,
      group: this.groupData,
      order: this.groupData,
      chartGroup: {
        id: this.dashBoard.id,
      },
    };
    if (this.tableData.length > 0) {
      this.createTable(tableData);
    }
  }

  updateData() {
    this.showPreviewButton = false;
    this.identifiersData();
    this.dataRepo();
    const tableData = {
      title: this.tableTitle,
      sql: this.sql,
      tableData: this.tableData,
      filters: this.filtersData,
      group: this.groupData,
      order: this.groupData,
      chartGroup: {
        id: this.dashBoard.id,
      },
    };

    this.updateChart(tableData);
  }

  createTable(chartData: any) {
    this.chartsService.createTables(this.headers, chartData).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tabela criada',
        });
        this.showPreviewButton = false;
        this.tablePreView(data);
        this.tableId = data.id;
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

  updateChart(chartData: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    if (this.tableId == null) {
      this.tableId = this.itemId;
    } else if (this.itemId == null) {
      this.tableId = this.tableId;
    }

    this.chartsService
      .updateTables(headers, chartData, this.tableId)
      .subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Informações da tabela atualizadas',
          });
          this.tablePreView(data);
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

  tablePreView(data: any) {
    this.showTableColumns = [];
    this.showTableData = [];

    const columns = data.tableData.map((td: any) => ({
      field: td.column[0],
      header: td.th[0],
    }));
    this.showTableColumns = columns;

    const rowCount = data.tableData[0].td.length;

    for (let i = 0; i < rowCount; i++) {
      const row: any = {};
      data.tableData.forEach((td: any) => {
        row[td.column[0]] = td.td[i];
      });
      this.showTableData.push(row);
    }
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
      this.chartsService.deleteTables(this.headers, this.tableId).subscribe({
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

  loadTableEdit(id: any) {
    this.chartsService.getTableById(id, this.headers).subscribe({
      next: (value) => {
        this.dataEditProcessor(value);
      },
    });
  }

  dataEditProcessor(value: any) {
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

    const tableData = value.tableData.map((axis: any) => {
      return {
        name: axis.agregator[0],
        identifiers: axis.th[0],
        value:
          axis.type[0] != 'timestamp'
            ? axis.agregator[0]
            : this.returnValueEdit(axis),
        type: axis.type[0],
      };
    });
    const id = value.id;
    this.tableTitle = value.title;
    this.sql = value.sql;
    this.tabledata = tableData;
    this.filters = columnFilterNames;
    this.loadInitialEdtTable(id);
  }

  returnValueEdit(data: any) {
    if (data.type[0] === 'timestamp') {
      const agregator = data.agregator[0].trim();

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

  loadInitialEdtTable(id: any) {
    this.chartsService.getTableById(id, this.headers).subscribe({
      next: (value) => {
        this.tablePreView(value);
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

  updateTabText(tabName: string) {
    this.selectedTab = tabName;
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selectRow(row: PeriodicElement) {
    this.selectedRow = row;
  }

  isSelected(row: PeriodicElement): boolean {
    return this.selectedRow === row;
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
