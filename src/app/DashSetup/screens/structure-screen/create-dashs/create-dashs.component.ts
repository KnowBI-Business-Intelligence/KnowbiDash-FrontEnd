import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { FilterMetadata, MenuItem, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DashboardTable } from '../../../../core/modules/interfaces';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { MatSortModule } from '@angular/material/sort';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClose,
  faFilterCircleXmark,
  faMagnifyingGlass,
  faTableCells,
} from '@fortawesome/free-solid-svg-icons';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { ChartgroupService } from '../../../../core/services/chartgroup/chartgroup.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-create-dashs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    MatPaginator,
    MatSortModule,
    ToastModule,
    DropdownModule,
    FontAwesomeModule,
    SkeletonModule,
  ],
  templateUrl: './create-dashs.component.html',
  styleUrls: [
    './create-dashs.component.css',
    '../../../../core/globalStyle/toast.css',
  ],
})
export class CreateDashsComponent implements OnInit {
  icons = {
    filter: faFilterCircleXmark,
    closed: faClose,
    search: faMagnifyingGlass,
    table: faTableCells,
  };

  createRegisterForm = this.formBuilder.group({
    name: ['', Validators.required],
    pgTableName: ['', Validators.required],
    sql: ['', Validators.required],
    chartPath: ['', Validators.required],
  });

  editDashForm = this.formBuilder.group({
    name: ['', Validators.required],
    pgTableName: ['', Validators.required],
    sql: ['', Validators.required],
    chartPath: ['', Validators.required],
  });

  list: HTMLElement | null = null;
  body: HTMLElement | null = null;
  groupButton: HTMLElement | null = null;
  addButton: HTMLElement | null = null;
  deleteButton: HTMLElement | null = null;
  seeButton: HTMLElement | null = null;
  add: HTMLElement | null = null;
  cancel: HTMLElement | null = null;

  items: MenuItem[] | undefined;

  selectedDash!: DashboardTable;

  displayedColumns: string[] = [
    'id',
    'name',
    'pgTableName',
    'chartPath',
    'sql',
  ];

  deleteProfile: boolean = false;
  isViewDashboard: boolean = false;
  actionButton: boolean = false;
  actionSQLButton: boolean = false;
  isSQL: boolean = false;
  showModal: boolean = false;
  isLoadingRun: boolean = false;
  isLoadingTable: boolean = false;
  isReadOnly: boolean = false;
  isInformations: boolean = false;
  isLoadTable: boolean = true;
  isStartScript: boolean = false;

  dataSource: any;
  chartPaths: any;
  dashId: any;

  requestChartPaths: any[] = [];
  tableColumns: any[] = [];
  tableData: any[] = [];

  selectedTab: string = '---';
  searchValue?: string;
  scriptStatus: string = '';
  statusExecuting: string = '';
  scriptDataExecute: string = '';
  resultsLength: number = 0;
  selectedRow!: DashboardTable | null;
  selectedRowChartGroup: any;
  inMemoryDash: any;
  private chartGroupID: any;
  sqlPlaceholder: any;

  private user = this.token.getUser();

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private elementRef: ElementRef,
    private charts: ChartsService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalstorageService,
    private messageService: MessageService,
    private chartGroupService: ChartgroupService
  ) {}

  ngOnInit(): void {
    this.getChartsGroup();
    this.getChartPath();
    this.inMemoryDash =
      this.localStorageService.getDecryptedItem('chartGroupview');
  }

  private getChartPath() {
    this.charts.getChartsPath(this.headers).subscribe({
      next: (value: any) => {
        this.chartPaths = value;
      },
      error(err: any) {},
    });
  }

  onRowSelect(event: MouseEvent, element: any) {
    event.preventDefault();
  }

  private getChartsGroup() {
    this.charts.getChartGroup(this.headers).subscribe({
      next: (value: any) => {
        this.dataSource = value;

        this.resultsLength = value?.length;
      },
      error: (err: any) => {},
    });
  }

  private getTableData(id: any) {
    this.tableColumns = [];
    this.tableData = [];
    this.charts.getChartsTableData(id, this.headers).subscribe({
      next: (value: any) => {
        this.isLoadTable = false;
        this.scriptStatus = value.executionStatus;
        this.scriptDataExecute = value.executedIn;
        this.tableColumns = value.columns;
        this.tableData = value.data;
        this.isLoadingTable = false;
        this.isInformations = true;
      },
      error: (err) => {
        this.errorMessageToast('Este dashboard ainda não tem dados');
        this.isLoadingTable = false;
        this.isLoadTable = false;
      },
    });
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selectRow(row: DashboardTable) {
    this.selectedRow = row;
    this.dashId = row.id;
    this.deleteButton =
      this.elementRef.nativeElement.querySelector('#deleteButton');
    this.seeButton = this.elementRef.nativeElement.querySelector('#seeButton');

    if (this.deleteButton) {
      this.deleteButton.style.color = '#4f80e1';
    }
    if (this.seeButton) {
      this.seeButton.style.color = '#4f80e1';
    }
  }

  printDetails(event: any, path: any) {
    if (event.target.checked) {
      if (!this.requestChartPaths.some((item) => item.id === path)) {
        this.requestChartPaths.push({ id: path });
      }
    } else {
      const index = this.requestChartPaths.findIndex(
        (item) => item.id === path
      );
      if (index !== -1) {
        this.requestChartPaths.splice(index, 1);
      }
    }
  }

  isSelected(path: any): boolean {
    if (
      this.selectedRow?.chartPath &&
      Array.isArray(this.selectedRow.chartPath)
    ) {
      const isPathSelected = this.selectedRow.chartPath.some((data: any) => {
        return data.id == path.id;
      });
      return isPathSelected;
    }
    return false;
  }

  clear(table: Table): void {
    table.clear();
    this.searchValue = '';
  }

  onInputChange(event: any, table: Table): void {
    if (event.target instanceof HTMLInputElement) {
      const inputValue: string = event.target.value;

      if (inputValue.trim() !== '') {
        const customFilter: FilterMetadata = {
          value: inputValue,
          matchMode: 'contains',
        };

        const filters: { [s: string]: FilterMetadata } = {};

        for (const field of table.globalFilterFields!) {
          filters[field] = customFilter;
        }

        table.filterGlobal(inputValue, 'contains');
      } else {
        this.clear(table);
      }
    }
  }

  viewDashInfo() {
    this.requestChartPaths = [];
    this.isReadOnly = true;
    this.actionButton = true;
    this.isViewDashboard = true;
    this.selectedRowChartGroup = this.selectedRow;
    this.getChartPath();

    const hasColumns =
      Array.isArray(this.selectedRowChartGroup.columns) &&
      this.selectedRowChartGroup.columns.length > 0;
    const hasSql =
      this.selectedRowChartGroup.sql &&
      this.selectedRowChartGroup.sql.trim() !== '';

    this.isReadOnly = hasColumns && hasSql;
    this.selectedRowChartGroup.chartPath.forEach((data: any) => {
      this.requestChartPaths.push({ id: data.id });
    });
  }

  notViewDashInfo() {
    this.isViewDashboard = false;
    this.actionButton = false;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'none';
    }
    this.getChartsGroup();
  }

  deleteRegister() {
    this.deleteProfile = true;
    this.actionButton = true;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'blur(3px)';
    }
  }

  createRegister() {
    const name = this.createRegisterForm.get('name')?.value as string;
    const pgTableName = this.createRegisterForm.get('pgTableName')
      ?.value as string;
    const chartPath = this.requestChartPaths.map((path: any) => {
      return { id: path.id.toString() };
    });

    const object = {
      name: name,
      pgTableName: pgTableName + '_',
      chartPath: chartPath,
    };

    this.charts.createChartGroup(object, this.headers).subscribe({
      next: () => {
        this.successMessageToast('Dashboard criado');
        this.cancelRegister();
      },
      error: (err) => {
        this.errorMessageToast('Verifique os campos preenchidos');
      },
    });
  }

  addRegister() {
    this.getChartPath();

    this.list = this.elementRef.nativeElement.querySelector('#list');
    this.add = this.elementRef.nativeElement.querySelector('#add');

    if (this.list) {
      this.list.style.display = 'none';
    }
    if (this.add) {
      this.add.style.display = 'block';
    }
  }

  cancelDelete() {
    this.deleteProfile = false;
    this.actionButton = false;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'none';
    }
    this.getChartsGroup();
  }

  confirmDelete() {
    if (this.selectedRow) {
      this.charts
        .deleteChartGroup(this.headers, this.selectedRow.id)
        .subscribe({
          next: () => {
            if (this.inMemoryDash != null) {
              if (this.inMemoryDash.id == this.selectedRow!.id) {
                this.localStorageService.removeItem('chartGroupview');
                this.chartGroupService.clearEncryptedData();
                this.chartGroupService.clearData();
              }
            }
            this.successMessageToast('Dashboard excluído');
            this.cancelDelete();
          },
          error: () => {
            this.errorMessageToast('Erro ao excluir');
          },
        });
    }
  }

  cancelRegister() {
    this.getChartsGroup();
    this.list = this.elementRef.nativeElement.querySelector('#list');
    this.add = this.elementRef.nativeElement.querySelector('#add');

    this.createRegisterForm.reset({
      name: '',
      pgTableName: '',
      sql: '',
      chartPath: '',
    });

    if (this.list) {
      this.list.style.display = 'flex';
    }
    if (this.add) {
      this.add.style.display = 'none';
    }
  }

  updateRegister() {
    const name = this.editDashForm.get('name')?.value as string;
    const pgTableName = this.editDashForm.get('pgTableName')?.value as string;
    const chartPath = this.requestChartPaths.map((path: any) => {
      return { id: path.id.toString() };
    });

    const object = {
      name: name,
      pgTableName: pgTableName,
      chartPath: chartPath,
    };

    this.charts.updateChartGroup(this.headers, object, this.dashId).subscribe({
      next: () => {
        this.successMessageToast('Dashboard atualizado');
        this.notViewDashInfo();
      },
      error: (err) => {
        this.errorMessageToast(err.error.error);
      },
    });
  }

  updateRegisterSql() {
    const sqlCode = this.createRegisterForm.get('sql')?.value as any;
    const id = Number(this.chartGroupID);
    if (sqlCode.trim() === '') {
      this.errorMessageToast('Verifique o código SQL');
    } else if (this.containsProhibitedSQL(sqlCode)) {
      this.errorMessageToast(
        'O script não pode conter instruções diferente de SELECT'
      );
    } else {
      this.isStartScript = true;
      this.isInformations = false;
      this.isLoadingRun = true;
      this.scriptStatusExecuting();
      this.charts.updateChartGroupSQL(this.headers, sqlCode, id).subscribe({
        next: (value: any) => {
          this.successMessageToast('SQL Atualizado');
          this.isLoadingRun = false;
          this.isInformations = true;
          this.isStartScript = false;
          this.showTable();
        },
        error: (err) => {
          const errorObj = JSON.parse(err.error);
          let errorDetail =
            errorObj.error ||
            `Status: ${errorObj.status}, Executado em: ${errorObj.executedIn}`;
          this.scriptStatus = errorObj.status;
          this.scriptDataExecute = errorObj.executedIn;

          this.errorMessageToast(errorDetail);
          this.isInformations = true;
          this.isLoadingRun = false;
          this.isStartScript = false;
          this.showTable();
        },
      });
    }
  }

  scriptStatusExecuting() {
    this.statusExecuting =
      'Executando script SQL na base de dados de origem...';

    setTimeout(async () => {
      this.statusExecuting = 'Obtendo dados da base de origem...';
      await this.delay(2000);
      this.statusExecuting = 'Iniciando Processamento...';
      await this.delay(2000);
      this.statusExecuting = 'Copiando dados e finalizando ajustes...';
    }, 1000);
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  errorMessageToast(message: string) {
    return this.messageService.add({
      severity: 'error',
      detail: message,
    });
  }

  successMessageToast(message: string) {
    return this.messageService.add({
      severity: 'success',
      detail: message,
    });
  }

  containsProhibitedSQL(sql: string): boolean {
    const prohibitedKeywords = ['DELETE', 'INSERT', 'UPDATE'];
    const regex = new RegExp(`\\b(${prohibitedKeywords.join('|')})\\b`, 'i');
    return regex.test(sql);
  }

  showTable() {
    this.isLoadTable = true;
    const id = Number(this.chartGroupID);
    this.isLoadingTable = true;
    this.getTableData(id);
  }

  onRowDoubleClick(row: DashboardTable) {
    this.isInformations = false;
    this.isSQL = true;
    this.chartGroupID = row.id;
    this.sqlPlaceholder = row.sql;
  }

  goBack() {
    this.isSQL = false;
    this.tableColumns = [];
    this.tableData = [];
    this.getChartsGroup();
  }

  clearSQL() {
    this.createRegisterForm.reset({
      sql: '',
    });

    this.editDashForm.reset({
      sql: '',
    });
  }
}
