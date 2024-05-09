import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { map, Observable, startWith } from 'rxjs';
import { ProfileTable } from '../../../../core/modules/interfaces';
import { ChartsService } from '../../../../core/services/charts/charts.service';
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
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  providers: [MessageService],
  templateUrl: './create-profiles.component.html',
  styleUrl: './create-profiles.component.css',
})
export class CreateProfilesComponent implements OnInit {
  @ViewChild('folderInput') folderInput!: ElementRef<HTMLInputElement>;

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
  isEditProfile: boolean = false;

  dataSource: any;

  private headers: any;

  selectedTab: string = '---';
  resultsLength: number = 0;
  selectedRow: ProfileTable | null = null;
  selectedProfile: ProfileTable | null = null;
  selectedRowChart: any;

  announcer = inject(LiveAnnouncer);
  folders: string[] = [];
  filteredFolders!: Observable<string[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  folderControl = new FormControl('');
  allFolders: { name: string; id: string }[] = [];
  folderId: string[] = [];

  constructor(
    private elementRef: ElementRef,
    private profile: ProfilesService,
    private charts: ChartsService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.filteredFolders = this.folderControl.valueChanges.pipe(
      startWith(null),
      map((folder: string | null) =>
        folder
          ? this._filter(folder)
          : this.allFolders.map((folder) => folder.name)
      )
    );
  }

  ngOnInit(): void {
    this.getProfiles();
    this.getFolders();

    this.filteredFolders = this.folderControl.valueChanges.pipe(
      startWith(null),
      map((folder: string | null) =>
        folder
          ? this._filter(folder)
          : this.allFolders.map((folder) => folder.name)
      )
    );
  }

  private getFolders() {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.charts.getChartsPath(headers).subscribe({
      next: (value: any) => {
        this.allFolders = value.map((item: any) => ({
          name: item.name,
          id: item.id,
        }));

        this.filteredFolders = this.folderControl.valueChanges.pipe(
          startWith(null),
          map((folder: string | null) =>
            folder
              ? this._filter(folder)
              : this.allFolders.map((folder) => folder.name)
          )
        );
      },
    });
  }

  private getProfiles() {
    const user = this.storageService.getUser();
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
    this.getProfiles();
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
    this.selectedProfile = row;
    this.isEditProfile = true;
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

  updateProfile() {
    const profileIds = this.folderId.map((id) => ({ id }));
    const dataUpdate = {
      name: (this.createProfilesForm.get('name')?.value as string)
        ? (this.createProfilesForm.get('name')?.value as string)
        : this.selectedRow?.name,
      observation: (this.createProfilesForm.get('observation')?.value as string)
        ? (this.createProfilesForm.get('observation')?.value as string)
        : this.selectedRow?.observation,
      chartPaths: profileIds,
    };

    this.profile
      .updateProfiles(
        this.headers,
        this.selectedProfile?.id as string,
        dataUpdate
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
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

    this.isEditProfile = false;
  }

  removeFolder(folder: any) {
    const index = this.folders.indexOf(folder);

    if (index >= 0) {
      const removedFolder = this.folders.splice(index, 1)[0];
      const removedFolderId = this.folderId.splice(index, 1)[0];

      const removedFolderObject = {
        name: removedFolder,
        id: removedFolderId,
      };

      this.allFolders.push(removedFolderObject);

      this.announcer.announce(`Removed ${folder}`);

      this.filteredFolders = this.folderControl.valueChanges.pipe(
        startWith(null),
        map((folder: string | null) =>
          folder
            ? this._filter(folder)
            : this.allFolders.map((folder) => folder.name)
        )
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFolders
      .map((folder) => folder.name)
      .filter((name) => name.toLowerCase().includes(filterValue));
  }

  selectedFolders($event: MatAutocompleteSelectedEvent) {
    const selectedFolder = this.allFolders.find(
      (folder) => folder.name === $event.option.viewValue
    );
    if (selectedFolder) {
      if (!this.folders.includes(selectedFolder.name)) {
        this.folders.push(selectedFolder.name);
        this.folderId.push(selectedFolder.id);
      }
      const index = this.allFolders.findIndex(
        (folder) => folder.name === selectedFolder.name
      );
      if (index !== -1) {
        this.allFolders.splice(index, 1);
      }
    }
    this.folderInput.nativeElement.value = '';
    this.folderControl.setValue(null);
  }

  addFolder($event: MatChipInputEvent) {
    $event.chipInput!.clear();
    this.folderControl.setValue(null);
  }
}
