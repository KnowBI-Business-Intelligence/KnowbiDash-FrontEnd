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
import { MatTableModule } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProfileTable } from '../../../../core/modules/interfaces';
import { ProfilesService } from '../../../../core/services/profiles/profiles.service';
import { StorageService } from '../../../../core/services/user/storage.service';

@Component({
  selector: 'app-create-profiles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    ContextMenuModule,
    ToastModule,
    TableModule,
  ],
  providers: [MessageService],
  templateUrl: './create-profiles.component.html',
  styleUrl: './create-profiles.component.css',
})
export class CreateProfilesComponent implements OnInit {
  createProfilesForm = this.formBuilder.group({
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

  deleteProfile: boolean = false;
  isViewProfile: boolean = false;
  actionButton: boolean = false;

  dataSource: any;

  private headers: any;

  selectedTab: string = '---';
  resultsLength: number = 0;
  selectedRow: ProfileTable | null = null;
  selectedProfile: ProfileTable | null = null;
  selectedRowChart: any;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private elementRef: ElementRef,
    private profile: ProfilesService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
  }

  private getProfiles() {
    const user = this.token.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.profile.getProfiles(this.headers).subscribe({
      next: (value: any) => {
        this.dataSource = value;
        this.resultsLength = value?.length;
      },
      error: (err: Error) => {
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
    this.isViewProfile = !this.isViewProfile;
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
    this.getProfiles();
  }

  onRowDoubleClick(row: ProfileTable) {
    console.log('double click:', row);
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
    if (this.selectedRow) {
      this.profile.deleteProfiles(this.headers, this.selectedRow.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'sucess',
            summary: 'Sucesso',
            detail: 'Perfil excluído!',
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

    this.profile.createProfiles(this.headers, name, observation).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'sucess',
          summary: 'Sucesso',
          detail: 'Perfil criado!',
        });
        this.cancelRegister();
        this.createProfilesForm.reset({ name: '', observation: '' });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro na autenticação.',
        });
      },
    });
  }
}
