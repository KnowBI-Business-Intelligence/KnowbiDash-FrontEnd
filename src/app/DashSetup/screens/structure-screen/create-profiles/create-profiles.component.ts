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
import {
  faClose,
  faFilterCircleXmark,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FilterMetadata, MessageService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Path, ProfileTable } from '../../../../core/modules/interfaces';
import { ProfilesService } from '../../../../core/services/profiles/profiles.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-create-profiles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginator,
    MatSortModule,
    ContextMenuModule,
    ToastModule,
    TableModule,
    FontAwesomeModule,
  ],
  providers: [MessageService],
  templateUrl: './create-profiles.component.html',
  styleUrl: './create-profiles.component.css',
})
export class CreateProfilesComponent implements OnInit {
  icons = {
    filter: faFilterCircleXmark,
    closed: faClose,
    search: faMagnifyingGlass,
  };

  createProfilesForm = this.formBuilder.group({
    name: ['', Validators.required],
    observation: ['', Validators.required],
  });

  editProfilesForm = this.formBuilder.group({
    name: ['', Validators.required],
    observation: ['', Validators.required],
  });

  list: HTMLElement | null = null;
  body: HTMLElement | null = null;
  groupButton: HTMLElement | null = null;
  addButton: HTMLElement | null = null;
  deleteButton: HTMLElement | null = null;
  seeButton: HTMLElement | null = null;
  add: HTMLElement | null = null;
  cancel: HTMLElement | null = null;

  displayedColumns: string[] = ['id', 'name', 'observation', 'chartPaths'];
  searchValue?: string;
  listPaths: Path[] = [];
  editPath: Path[] = [];
  requestChartPaths: any[] = [];

  deleteProfile: boolean = false;
  isViewProfile: boolean = false;
  actionButton: boolean = false;
  isEditProfile: boolean = false;

  dataSource: any;

  selectedTab: string = '---';
  resultsLength: number = 0;
  selectedRow: ProfileTable | null = null;
  selectedProfile: ProfileTable | null = null;
  selectedRowChart: any;
  profileId: any;

  private user = this.token.getUser();

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  customers!: ProfileTable[];

  selectedCustomers!: ProfileTable;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private elementRef: ElementRef,
    private profile: ProfilesService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private chartServices: ChartsService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  private getProfiles() {
    this.profile.getProfiles(this.headers).subscribe({
      next: (value: any) => {
        this.dataSource = value;
        this.resultsLength = value?.length;
        this.getPaths();
      },
      error: (err: Error) => {},
    });
  }

  getPaths() {
    this.chartServices.getChartsPath(this.headers).subscribe({
      next: (value: any) => {
        this.loadPaths(value);
      },
    });
  }

  loadPaths(data: any) {
    this.listPaths = [];
    data.forEach((content: any) => {
      this.listPaths.push(content);
    });
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
      this.selectedRow?.chartPaths &&
      Array.isArray(this.selectedRow.chartPaths)
    ) {
      return this.selectedRow.chartPaths.some(
        (chartPath) => chartPath.id === path.id && chartPath.name === path.name
      );
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

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selectRow(row: ProfileTable) {
    this.selectedRow = row;
    this.deleteButton =
      this.elementRef.nativeElement.querySelector('#deleteButton');
    this.seeButton = this.elementRef.nativeElement.querySelector('#seeButton');
    this.profileId = row.id;
    if (this.deleteButton) {
      this.deleteButton.style.color = '#4f80e1';
    }
    if (this.seeButton) {
      this.seeButton.style.color = '#4f80e1';
    }
  }

  viewProfile() {
    this.requestChartPaths = [];
    this.isViewProfile = !this.isViewProfile;
    this.selectedRowChart = this.selectedRow?.chartPaths;
    this.getPaths();
    this.selectedRowChart.forEach((data: any) => {
      if (
        this.listPaths.some(
          (path: any) => path.id === data.id && path.name === data.name
        )
      ) {
        this.requestChartPaths.push({ id: data.id });
      }
    });
  }

  notViewProfile() {
    this.isViewProfile = false;
    this.actionButton = false;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'none';
    }
    this.getProfiles();
  }

  onRowDoubleClick(row: ProfileTable) {
    //console.log('double click:', row);
  }

  deleteProfiles() {
    this.deleteProfile = true;
    this.actionButton = true;
    const table =
      this.elementRef.nativeElement.querySelector('.container-content');

    if (table) {
      table.style.filter = 'blur(3px)';
    }
  }

  addRegister() {
    this.getPaths();
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
    this.getProfiles();
  }

  confirmDelete() {
    this.cancelDelete();
    if (this.selectedRow) {
      this.profile.deleteProfiles(this.headers, this.selectedRow.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Perfil excluído',
          });
          this.cancelDelete();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'verifique os vinculos do perfil',
          });
        },
      });
    }
  }

  cancelRegister() {
    this.getProfiles();
    this.list = this.elementRef.nativeElement.querySelector('#list');
    this.add = this.elementRef.nativeElement.querySelector('#add');

    if (this.list) {
      this.list.style.display = 'flex';
    }
    if (this.add) {
      this.add.style.display = 'none';
    }
  }

  createProfile() {
    const name = this.createProfilesForm.get('name')?.value as string;
    const observation = this.createProfilesForm.get('observation')
      ?.value as string;

    const chartPaths = this.requestChartPaths.map((path: any) => {
      return { id: path.id.toString() };
    });

    const requestBody = {
      name,
      observation,
      chartPaths,
    };

    this.profile.createProfiles(requestBody, this.headers).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Perfil criado',
        });
        this.cancelRegister();
        this.createProfilesForm.reset({ name: '', observation: '' });
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

  updateProfile() {
    this.notViewProfile();
    const name = this.editProfilesForm.get('name')?.value as string;
    const observation = this.editProfilesForm.get('observation')
      ?.value as string;

    const chartPaths = this.requestChartPaths.map((path: any) => {
      return { id: path.id.toString() };
    });

    const requestBody = {
      name,
      observation,
      chartPaths,
    };

    this.profile
      .updateProfiles(this.profileId, requestBody, this.headers)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Perfil atualizado',
          });
          this.cancelRegister();
          this.editProfilesForm.reset({ name: '', observation: '' });
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
}
