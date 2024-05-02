import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MenuItem, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
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
    ReactiveFormsModule,
    TableModule,
    MatPaginator,
    ToastModule,
    DropdownModule,
    MatProgressBarModule,
  ],
  templateUrl: './create-dashs.component.html',
  styleUrl: './create-dashs.component.css',
})
export class CreateDashsComponent implements OnInit {
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
  isSQL: boolean = false;
  showModal: boolean = false;
  progressBar: boolean = false;

  dataSource: any;

  chartPaths: any;
  sqlResult: any;
  selectedTab: string = '---';
  resultsLength: number = 0;
  selectedRow!: DashboardTable | null;
  selectedRowChartGroup: any;

  private headers: any;
  private chartGroupID: any;
  sqlPlaceholder: any;

  constructor(
    private elementRef: ElementRef,
    private charts: ChartsService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getChartsGroup();
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
    const sqlCode = this.createRegisterForm.get('sql')?.value as any;

    if (sqlCode.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Verifique o campo.',
      });
    } else {
      this.progressBar = true;
      this.messageService.add({
        severity: '-',
        summary: 'Aguarde',
        detail: 'Criando metadado!',
      });

      this.charts
        .updateChartGroupSQL(this.headers, this.chartGroupID, sqlCode)
        .subscribe({
          next: (value: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'SQL Atualizado!',
            });
            this.sqlResult = value;
            this.progressBar = false;
          },
          error: () => {
            console.log('ERRRRRO NEXCE SACARASDA');

            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro no processo.',
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
            severity: 'sucess',
            summary: 'Sucesso',
            detail: 'SQL Atualizado!',
          });

          this.sqlResult = value;
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
  }

  createRegister() {
    const name = this.createRegisterForm.get('name')?.value as string;
    const pgTableName = this.createRegisterForm.get('pgTableName')
      ?.value as string;
    const chartPath = this.createRegisterForm.get('chartPath')?.value as any;

    this.charts
      .createChartGroup(this.headers, name, pgTableName, chartPath.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'sucess',
            summary: 'Sucesso',
            detail: 'Gráfico criado!',
          });
          this.cancelRegister();
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

  goBack() {
    this.isSQL = false;
  }

  clearSQL() {
    this.createRegisterForm.reset({
      sql: '',
    });
  }
}
