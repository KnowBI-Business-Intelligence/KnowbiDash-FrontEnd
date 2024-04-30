import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MenuItem, MessageService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DashboardTable } from '../../../../core/modules/interfaces';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { StorageService } from '../../../../core/services/user/storage.service';

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
    SliderModule,
    DropdownModule,
    MatProgressBarModule,
    ContextMenuModule,
  ],
  templateUrl: './create-dashs.component.html',
  styleUrl: './create-dashs.component.css',
})
export class CreateDashsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  createRegisterForm = this.formBuilder.group({
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
  isSQL: boolean = true;
  progressBar: boolean = false;
  ISSqlResult: boolean = false;
  isEditing: boolean = false;
  showModal: boolean = false;

  dataSource: any;
  private headers: any;
  private chartGroupID: any;

  chartPaths: any;
  sqlResult: any;
  selectedTab: string = '---';
  resultsLength: number = 0;
  selectedRow!: DashboardTable | null;
  selectedRowChartGroup: any;

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
    this.items = [
      {
        label: 'Atualizar SQL',
        command: () => this.updateSQL(),
      },
    ];
  }

  private getChartPath() {
    const user = this.token.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

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
    this.selectedDash = element;
    console.log(this.selectedDash);
  }

  private getChartsGroup() {
    const user = this.token.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.charts.getChartGroup(this.headers).subscribe({
      next: (value: any) => {
        this.dataSource = value;
        this.resultsLength = value?.length;
      },
      error(err: any) {
        console.error(err);
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

  isSelected(row: DashboardTable): boolean {
    return this.selectedRow === row;
  }

  viewDashInfo() {
    this.isViewDashboard = true;
    this.selectedRowChartGroup = this.selectedRow?.chartPath;

    this.actionButton = true;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'blur(3px)';
    }
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

  onRowDoubleClick(row: DashboardTable) {
    console.log('double click:', row);
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
              severity: 'sucess',
              summary: 'Sucesso',
              detail: 'Dashboard excluído!',
            });
            this.cancelDelete();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao excluir.',
            });
          },
        });
    }
  }

  cancelRegister() {
    this.getChartsGroup();
    this.list = this.elementRef.nativeElement.querySelector('#list');
    this.add = this.elementRef.nativeElement.querySelector('#add');

    if (this.list) {
      this.list.style.display = 'flex';
    }
    if (this.add) {
      this.add.style.display = 'none';
    }
  }

  finishProcess() {
    this.cancelRegister();
    this.isEditing = false;
    this.isSQL = true;
    console.log('eu finalizo');
  }

  updateSQL() {
    this.addRegister();
    this.isEditing = true;
    this.isSQL = false;
    console.log('eu atualizo');
  }

  updateRegister() {
    this.progressBar = true;
    const sql = this.createRegisterForm.get('sql')?.value as string;
    this.charts
      .updateChartGroupSQL(this.headers, this.chartGroupID, sql)
      .subscribe({
        next: (value: any) => {
          this.messageService.add({
            severity: 'sucess',
            summary: 'Sucesso',
            detail: 'Processo Finalizado!',
          });
          this.sqlResult = value;
          this.ISSqlResult = true;
          this.progressBar = false;
          this.finishProcess();
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

  createRegister() {
    const name = this.createRegisterForm.get('name')?.value as string;
    const pgTableName = this.createRegisterForm.get('pgTableName')
      ?.value as string;
    const chartPath = this.createRegisterForm.get('chartPath')?.value as any;

    this.charts
      .createChartGroup(this.headers, name, pgTableName, chartPath.id)
      .subscribe({
        next: (value: any) => {
          this.messageService.add({
            severity: 'sucess',
            summary: 'Sucesso',
            detail: 'Dashboard criado!',
          });
          this.chartGroupID = value?.id;
          this.isSQL = false;

          this.createRegisterForm.reset({
            name: '',
            pgTableName: '',
            sql: '',
            chartPath: '',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro na criação.',
          });
        },
      });
  }
}
