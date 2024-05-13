import { HttpHeaders } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

interface Axis {
  name: string;
  type: string;
  identifier: string;
  value: string;
}

interface TableRow {
  [key: string]: any;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
}

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
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  @Output() returnToCreate = new EventEmitter<void>();
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
  displayedColumns: string[] = [];
  displayedRows: TableRow[] = [];
  dataSource = new MatTableDataSource(this.displayedRows);
  selectedRow: PeriodicElement | null = null;
  selectedChartButton: string = '';
  tableTitle: string = '';
  chartType: string = '';
  selectedTab: string = '---';
  sql: string = 'SELECT ';
  tableName: string = '';
  identifier: string = '';
  selectedAggregation: string = '';
  dashBoard: any;
  tableId: any;
  showPreviewButton: boolean = true;
  showModal: boolean = false;
  modal: HTMLElement | undefined;
  selectedtabledata: Axis = { name: '', type: '', identifier: '', value: '' };
  buildData: { name: any; identifier: any }[] = [];
  sortDescriptions: { [key: string]: string } = {};
  tabledataValueWithoutAggregation: string = '';
  tabledataData: { [key: string]: string } = {};
  tabledataIdentifiers: { [key: string]: string } = {};
  user = this.storageService.getUser();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private storageService: StorageService,
    private localStorageService: LocalstorageService,
    private chartsService: ChartsService,
    private chartGroupService: ChartgroupService
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

  returnToCreateView(): void {
    this.chartGroupService.setCurrentView('ViewCreateComponent');
  }

  startDashboarData() {
    this.encryptedDataSubscription =
      this.chartGroupService.encryptedData$.subscribe((encryptedData) => {
        this.dashBoard = encryptedData;
        this.loadDataView(this.dashBoard.id);
        console.log(this.dashBoard);
      });
  }

  ngOnDestroy() {
    if (this.encryptedDataSubscription) {
      this.encryptedDataSubscription.unsubscribe();
    }
  }

  openMenu(index: number, item: any) {
    this.selectedtabledata = item;
    this.tabledata[index].identifier = this.identifier;
  }

  AxisValue(item: any) {
    this.selectedtabledata = item;
    if (this.identifier == '' || this.identifier == undefined) {
      this.identifier = this.selectedtabledata.name;
    } else {
      this.identifier = this.selectedtabledata.identifier;
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
    data.columns.forEach((setData: any) => {
      this.database.push(setData);
      this.tabledataData[setData.name] = setData;
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
            type: setData.type,
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

      if (columnNameRegex.test(tabledataName)) {
        const columnName = tabledataName.replace(columnNameRegex, '$1');
        let newAggregationValue;

        if (this.selectedtabledata.type === 'number') {
          newAggregationValue = aggregation + '(' + tabledataName + ')';
        } else {
          newAggregationValue = tabledataName;
        }

        const updatedAxis = {
          name: newAggregationValue,
          identifier: this.selectedtabledata.identifier
            ? this.selectedtabledata.identifier
            : this.selectedtabledata.name,
          type: this.selectedtabledata.type,
          value: columnName,
        };

        const index = this.tabledata.findIndex(
          (item) => item.name === tabledataName
        );
        if (index !== -1) {
          this.tabledata[index] = updatedAxis;
        }
      } else {
        const aggregationValue = aggregation + '(' + tabledataName + ')';
        const index = this.tabledata.findIndex(
          (item) => item.name === tabledataName
        );
        if (index !== -1) {
          this.tabledata[index] = {
            name: aggregationValue,
            identifier: this.selectedtabledata.identifier
              ? this.selectedtabledata.identifier
              : this.selectedtabledata.name,
            type: this.selectedtabledata.type,
            value: tabledataName,
          };
        }
      }
    }
  }

  editSave() {
    if (this.selectedtabledata) {
      this.selectedtabledata.identifier = this.identifier
        ? this.identifier
        : this.selectedtabledata.name;
      this.tabledataIdentifiers[this.selectedtabledata.name] =
        this.selectedtabledata.identifier;
    }
  }

  identifierData() {
    this.buildData = [];
    for (let i = 0; i < this.tabledata.length; i++) {
      const tabledataItem = this.tabledata[i].name;
      const tabledataidentifier = this.tabledata[i].value;
      let identifierItem = tabledataidentifier;
      const hasAggregation = /^(?:AVG|COUNT|SUM)\([^)]+\)$/.test(
        identifierItem
      );
      if (hasAggregation) {
        identifierItem = this.rmAgregateReplace(identifierItem);
      }
      if (this.tabledata[i].type == 'timestamp') {
        this.buildData.push({
          name: identifierItem,
          identifier: this.rmTimeStamp(tabledataItem),
        });
      } else {
        this.buildData.push({
          name: tabledataItem,
          identifier: identifierItem,
        });
      }
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
    });

    this.tableData = this.tabledata.map((axis) => {
      if (axis.type == 'numeric') {
        return {
          name: [this.rmAgregateReplace(axis.name)],
          identifiers: [axis.identifier],
        };
      } else if (axis.type == 'timestamp') {
        return {
          name: [this.rmTimeStamp(axis.name)],
          identifiers: [axis.identifier],
        };
      }
      return {
        name: [axis.name],
        identifiers: [axis.identifier],
      };
    });
  }

  seedData() {
    this.identifierData();
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

    console.log(tableData);
    this.createTable(tableData);
  }

  updateData() {
    this.showPreviewButton = false;
    this.identifierData();
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

    console.log(tableData);
    this.updateChart(tableData);
  }

  createTable(chartData: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.createTables(headers, chartData).subscribe({
      next: (data) => {
        this.showPreviewButton = false;
        this.tablePreView(data);
        this.tableId = data.id;
      },
    });
  }

  updateChart(chartData: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService
      .updateTables(headers, chartData, this.tableId)
      .subscribe({
        next: (data) => {
          this.tablePreView(data);
        },
      });
  }

  tablePreView(data: any) {
    if (data && data.tableData && data.tableData.length > 0) {
      this.displayedColumns = [];
      this.displayedRows = [];

      data.tableData.forEach((rowData: any) => {
        rowData.th.forEach((th: string) => {
          this.displayedColumns.push(th);
        });
      });

      const numRows = data.tableData[0].td.length;
      for (let i = 0; i < numRows; i++) {
        const row: any = {};
        data.tableData.forEach((rowData: any) => {
          rowData.th.forEach((th: string, index: number) => {
            row[th] = rowData.td[i];
          });
        });
        this.displayedRows.push(row);
      }

      this.displayedColumns.forEach((column) => {
        this.sortDescriptions[column] = `Sort by ${column}`;
      });
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
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });
    this.chartsService.deleteTables(headers, this.tableId).subscribe({
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

  updateTabText(tabName: string) {
    this.selectedTab = tabName;
  }

  announceSortChange(sortState: Sort) {
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

  onRowDoubleClick(row: PeriodicElement) {
    //console.log('Linha clicada duas vezes:', row);
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
