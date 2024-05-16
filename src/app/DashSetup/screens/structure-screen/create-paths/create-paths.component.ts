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
import { FilterMetadata, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PathTable, ProfileTable } from '../../../../core/modules/interfaces';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { ProfilesService } from '../../../../core/services/profiles/profiles.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClose,
  faFilterCircleXmark,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

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
    FontAwesomeModule,
  ],
  templateUrl: './create-paths.component.html',
  styleUrl: './create-paths.component.css',
})
export class CreatePathsComponent implements OnInit {
  icons = {
    filter: faFilterCircleXmark,
    closed: faClose,
    search: faMagnifyingGlass,
  };

  createFolderForm = this.formBuilder.group({
    name: ['', Validators.required],
    profile: ['', Validators.required],
  });

  editPathForm = this.formBuilder.group({
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

  pathId: any;
  profileId: any[] = [];
  dataSource: any;
  dataSourceGroup: any = [];
  requestChartPaths: any[] = [];

  private headers: any;

  selectedTab: string = '---';
  searchValue?: string;
  resultsLength: number = 0;
  selectedRow: PathTable | null = null;
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

  printDetails(event: any, path: any) {
    if (event.target.checked) {
      console.log('marcado ', path);
      if (!this.requestChartPaths.some((item) => item.id == path)) {
        this.requestChartPaths.push({ id: path });
        console.log(this.requestChartPaths);
      }
    } else {
      console.log('desmarcado ', path);
      const index = this.requestChartPaths.findIndex((item) => item.id == path);
      if (index != -1) {
        this.requestChartPaths.splice(index, 1);
        console.log(this.requestChartPaths);
      }
    }
  }

  isSelected(path: any): boolean {
    const uniqueIds = new Set();

    path.chartPaths.forEach((data: any) => {
      if (data.id == this.selectedRow?.id) {
        uniqueIds.add(data.id);
      }
    });

    if (uniqueIds.size > 0) {
      this.profileId = Array.from(uniqueIds).map((id) => ({ id }));
      return true;
    } else {
      return false;
    }
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

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selectRow(row: ProfileTable) {
    this.selectedRow = row;
    this.actionButton = false;
    this.deleteButton =
      this.elementRef.nativeElement.querySelector('#deleteButton');
    this.seeButton = this.elementRef.nativeElement.querySelector('#seeButton');
    this.pathId = row.id;
    if (this.deleteButton) {
      this.deleteButton.style.color = '#4f80e1';
    }
    if (this.seeButton) {
      this.seeButton.style.color = '#4f80e1';
    }
  }

  viewProfile() {
    this.getProfiles();
    this.profileId = [];
    this.requestChartPaths = [];
    this.isViewProfile = !this.isViewProfile;
    this.selectedRowChart = this.selectedRow;
    console.log(this.listProfiles);
    this.listProfiles.some((path: any) => {
      path.chartPaths.some((content: any) => {
        if (this.selectedRowChart.id == content.id) {
          this.requestChartPaths.push({ id: path.id });
        }
      });
    });

    console.log(this.requestChartPaths);
  }

  notViewProfile() {
    this.isViewProfile = false;
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
    this.requestChartPaths = [];
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
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Pasta excluída',
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

  createPath() {
    const name = this.createFolderForm.get('name')?.value as string;

    const chartProfiles = this.requestChartPaths.map((profile: any) => {
      return { id: profile.id.toString() };
    });

    const requestBody = {
      name: name,
      perfis: chartProfiles,
    };

    this.charts.createChartsPath(requestBody, this.headers).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Pasta criada',
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
          detail: 'Verifique os campos preenchidos',
        });
      },
    });
  }

  updatePath() {
    this.actionButton = true;
    const name = this.editPathForm.get('name')?.value as string;

    const chartPaths = this.requestChartPaths.map((path: any) => {
      return { id: path.id.toString() };
    });

    const requestBody = {
      name: name,
      perfis: chartPaths,
    };

    console.log(requestBody);
    this.charts
      .updateChartsPath(this.headers, requestBody, this.pathId)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Pasta atualizada',
          });
          this.notViewProfile();
          this.editPathForm.reset({ name: '', profile: '' });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Verifique os campos preenchidos',
          });
        },
      });
    this.getProfiles();
  }
}
