import { LiveAnnouncer } from '@angular/cdk/a11y';
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
import { MatSortModule } from '@angular/material/sort';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProfileTable } from '../../../../core/modules/interfaces';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { ProfilesService } from '../../../../core/services/profiles/profiles.service';
import { StorageService } from '../../../../core/services/user/storage.service';

@Component({
  selector: 'app-create-paths',
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
  ],
  templateUrl: './create-paths.component.html',
  styleUrl: './create-paths.component.css',
})
export class CreatePathsComponent implements OnInit {
  createFolderForm = this.formBuilder.group({
    name: ['', Validators.required],
    profile: ['', Validators.required],
  });

  list: HTMLElement | null = null;
  body: HTMLElement | null = null;
  groupButton: HTMLElement | null = null;
  addButton: HTMLElement | null = null;
  deleteButton: HTMLElement | null = null;
  seeButton: HTMLElement | null = null;
  add: HTMLElement | null = null;
  cancel: HTMLElement | null = null;

  displayedColumns: string[] = ['id', 'name', 'path'];

  deleteProfile: boolean = false;
  isViewProfile: boolean = false;
  actionButton: boolean = false;

  dataSource: any;
  dataSourceGroup: any = [];

  private headers: any;

  selectedTab: string = '---';
  resultsLength: number = 0;
  selectedRow: ProfileTable | null = null;
  selectedRowChart: any;
  listProfiles: any;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private elementRef: ElementRef,
    private charts: ChartsService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private profiles: ProfilesService
  ) {}

  ngOnInit(): void {
    this.getChartsPath();
    this.getProfiles();
  }

  private getChartsPath() {
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
        this.dataSource = value;

        this.resultsLength = value?.length;
        this.getGroupChart();
      },
      error(err: any) {
        console.error(err);
      },
    });
  }

  private getGroupChart() {
    this.charts.getChartGroup(this.headers).subscribe({
      next: (value: any) => {
        this.dataSourceGroup = this.dataSource.map((folder: any) => {
          const sameValue = value.find(
            (group: any) => group.chartPath && group.chartPath.id === folder.id
          );

          return {
            id: sameValue ? sameValue.id : folder.id,
            name: folder.name,
            path: sameValue ? sameValue?.name : 'Sem vinculo',
          };
        });
      },
      error: (err) => {
        throw new Error('we had an error here:', err);
      },
    });
  }

  private getProfiles() {
    this.profiles.getProfiles(this.headers).subscribe({
      next: (value) => {
        this.listProfiles = value;
      },
      error() {
        throw new Error('we had asn error here');
      },
    });
  }

  selectRow(row: ProfileTable) {
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

  isSelected(row: ProfileTable): boolean {
    return this.selectedRow === row;
  }

  viewProfile() {
    this.isViewProfile = true;
    this.selectedRowChart = this.selectedRow?.chartPaths;

    this.actionButton = true;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'blur(3px)';
    }
  }

  notViewProfile() {
    this.isViewProfile = false;
    this.actionButton = false;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'none';
    }
    this.getChartsPath();
  }

  onRowDoubleClick(row: ProfileTable) {
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
    this.getProfiles();
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
    this.getChartsPath();
  }

  confirmDelete() {
    if (this.selectedRow) {
      this.charts
        .deleteChartsPath(this.headers, this.selectedRow.id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'sucess',
              summary: 'Sucesso',
              detail: 'Pasta excluída!',
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
    this.getChartsPath();

    this.list = this.elementRef.nativeElement.querySelector('#list');
    this.add = this.elementRef.nativeElement.querySelector('#add');

    if (this.list) {
      this.list.style.display = 'flex';
    }
    if (this.add) {
      this.add.style.display = 'none';
    }
  }

  createRegister() {
    const name = this.createFolderForm.get('name')?.value as string;
    const profile = this.createFolderForm.get('profile')?.value as any;

    this.charts.createChartsPath(this.headers, name, profile.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'sucess',
          summary: 'Sucesso',
          detail: 'Pasta criada!',
        });
        this.cancelRegister();
        this.createFolderForm.reset({
          name: '',
          profile: '',
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
