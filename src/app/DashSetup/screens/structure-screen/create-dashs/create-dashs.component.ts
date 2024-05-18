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
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
} from '@fortawesome/free-solid-svg-icons';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
  ],
  templateUrl: './create-dashs.component.html',
  styleUrl: './create-dashs.component.css',
})
export class CreateDashsComponent implements OnInit {
  icons = {
    filter: faFilterCircleXmark,
    closed: faClose,
    search: faMagnifyingGlass,
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
  progressBar: boolean = false;

  dataSource: any;
  chartPaths: any;
  dashId: any;

  requestChartPaths: any[] = [];
  tableColumns: any[] = [];
  tableData: any[] = [];

  selectedTab: string = '---';
  searchValue?: string;
  resultsLength: number = 0;
  selectedRow!: DashboardTable | null;
  selectedRowChartGroup: any;
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getChartsGroup();
    this.getChartPath();
  }

  private getChartPath() {
    this.charts.getChartsPath(this.headers).subscribe({
      next: (value: any) => {
        this.chartPaths = value;
      },
      error(err: any) {
        console.error(err);
      },
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
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  private getTableData(id: any) {
    this.tableColumns = [];
    this.tableData = [];
    this.charts.getChartsTableData(id, this.headers).subscribe({
      next: (value: any) => {
        console.log(value);
        this.tableColumns = value.columns;
        this.tableData = value.data;
        console.log('Columns:', this.tableColumns);
        console.log('Data:', this.tableData);
      },
      error: (err) => {
        console.log(err);
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
    console.log(this.selectedRow);
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
        console.log(this.requestChartPaths);
      }
    } else {
      const index = this.requestChartPaths.findIndex(
        (item) => item.id === path
      );
      if (index !== -1) {
        this.requestChartPaths.splice(index, 1);
        console.log(this.requestChartPaths);
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
    this.isViewDashboard = true;
    this.selectedRowChartGroup = this.selectedRow;
    this.getChartPath();
    this.actionButton = true;

    this.selectedRowChartGroup.chartPath.forEach((data: any) => {
      console.log(data);
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
      pgTableName: pgTableName,
      chartPath: chartPath,
    };

    console.log(object);
    this.charts.createChartGroup(object, this.headers).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Dashboard criado',
        });
        this.cancelRegister();
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error.error,
        });
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
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Dashboard excluído',
            });
            this.cancelDelete();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao excluir',
            });
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

    console.log(object);
    this.charts.updateChartGroup(this.headers, object, this.dashId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Dashboard atualizado',
        });
        this.notViewDashInfo();
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error.error,
        });
      },
    });
  }

  updateRegisterSql() {
    const sqlCode = this.createRegisterForm.get('sql')?.value as any;
    const id = Number(this.chartGroupID);
    if (sqlCode.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Verifique o código SQL',
      });
    } else {
      this.charts.updateChartGroupSQL(this.headers, sqlCode, id).subscribe({
        next: (value: any) => {
          console.log(value);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'SQL Atualizado',
          });
          this.getTableData(this.chartGroupID);
          this.progressBar = false;
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error,
          });
        },
      });
    }
  }

  refreshRegister() {
    console.log('refresh', this.sqlPlaceholder);

    this.progressBar = true;
    this.charts
      .updateChartGroupSQL(this.headers, this.chartGroupID, this.sqlPlaceholder)
      .subscribe({
        next: (value: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'SQL Atualizado',
          });
          this.progressBar = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro no processo.',
          });
        },
      });
  }

  onRowDoubleClick(row: DashboardTable) {
    this.isSQL = true;
    this.chartGroupID = row.id;
    this.sqlPlaceholder = row.sql;
    console.log(row.sql);
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
