import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { Roles } from '../../../../assets/data/roles';
import { AuthService } from '../../../core/services/auth/auth.service';
import { StorageService } from '../../../core/services/user/storage.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-settings-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [MessageService],
  templateUrl: './settings-user.component.html',
  styleUrl: './settings-user.component.css',
})
export class SettingsUserComponent implements OnInit {
  @ViewChild('profileInput') profileInput!: ElementRef<HTMLInputElement>;

  rolesOptions: Roles[] | undefined;

  disabled: boolean = true;
  disabledAccessLevel: boolean = true;
  content_btns: boolean = true;

  buttonEdit: boolean = false;
  buttonConfirmCancel: boolean = false;

  infoUsersStorage?: {
    id: any;
    fullUserName: string;
    userName: string;
    password: string;
    email: string;
    roles: string;
  };

  infoUsersData?: {
    id: any;
    fullUserName: string;
    userName: string;
    password: string;
    cargo: string;
    email: string;
    roles: string;
  };

  form: any = {
    fullusername: null,
    username: null,
    password: null,
    email: null,
    occupation: null,
    access_levels: null,
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredProfiles!: Observable<string[]>;
  profiles: string[] = [];
  allProfiles: string[] = [];
  profilesCtrl = new FormControl('');

  announcer = inject(LiveAnnouncer);

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.rolesOptions = [
      { id: 'user', name: 'Usuário Padrão' },
      { id: 'mod', name: 'Usuário Moderador' },
      { id: 'admin', name: 'Usuário Administrador' },
    ];
    this.getUserData();
  }

  onEditCancel() {
    this.disabled = !this.disabled;
    this.buttonEdit = !this.buttonEdit;
    this.buttonConfirmCancel = !this.buttonConfirmCancel;

    const isAdmin = this.infoUsersStorage?.roles;

    if (isAdmin?.includes('ROLE_ADMIN')) {
      this.disabledAccessLevel = !this.disabledAccessLevel;
      this.content_btns = !this.content_btns;
    }
  }

  getUser() {
    const user = this.storageService.getUser();
    this.infoUsersStorage = user;
    return user;
  }

  getUserData() {
    const user = this.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.userService.getUsersInfo({ headers: headers }).subscribe({
      next: (data) => {
        if (this.infoUsersStorage?.userName) {
          data.forEach((value: any) => {
            if (value.userName === this.infoUsersStorage?.userName) {
              this.infoUsersData = value;
            }
          });
        }
      },
      error: (error) => {
        console.error('ErrgetInformations:', error);
      },
    });
  }

  getRoles(roles: any): string {
    try {
      switch (roles?.name) {
        case 'ROLE_ADMIN':
          return 'Administrador';

        case 'ROLE_MOD':
          return 'Moderador';

        default:
          return 'Comun';
      }
    } catch (error) {
      switch (roles) {
        case 'ROLE_ADMIN':
          return 'Administrador';

        case 'ROLE_MOD':
          return 'Moderador';

        default:
          return 'Comun';
      }
    }
  }

  getRolesUp(roles: string | undefined): string {
    try {
      switch (roles) {
        case 'ROLE_ADMIN':
          return 'admin';

        case 'ROLE_MOD':
          return 'mod';

        default:
          return 'user';
      }
    } catch (error) {
      throw error;
    }
  }

  // onSubmit() {
  //   const user = this.getUser();

  //   if (!user || !user.token) {
  //     console.error('Token não disponível');
  //     return;
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${user.token}`,
  //   });

  //   const {
  //     fullusername,
  //     username,
  //     password,
  //     email,
  //     occupation,
  //     access_level,
  //     profile,
  //   } = this.form;

  //   this.authService
  //     .edit(
  //       this.infoUsersStorage?.id,
  //       !username ? this.infoUsersStorage?.userName : username,
  //       !occupation ? this.infoUsersData?.cargo : occupation,
  //       !email ? this.infoUsersStorage?.email : email,
  //       !fullusername ? this.infoUsersStorage?.fullUserName : fullusername,
  //       !password ? this.infoUsersStorage?.password : password,
  //       !access_level
  //         ? this.getRolesUp(this.infoUsersStorage?.roles?.[0])
  //         : access_level.id,
  //       profile,
  //       headers
  //     )
  //     .subscribe({
  //       next: (data) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Sucesso',
  //           detail: 'Usuário Atualizado!',
  //         });
  //         this.onEditCancel();
  //       },
  //       error: (err) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Erro',
  //           detail:
  //             'Ocorreu um erro durante a atualização. Verifique os campos',
  //         });
  //         throw err;
  //       },
  //     });
  // }

  removeProfile(profile: any) {
    const index = this.profiles.indexOf(profile);

    if (index >= 0) {
      this.profiles.splice(index, 1);

      this.announcer.announce(`Removed ${profile}`);
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allProfiles.filter((profiles) =>
      profiles.toLowerCase().includes(filterValue)
    );
  }

  selectedProfiles($event: MatAutocompleteSelectedEvent) {
    this.profiles.push($event.option.viewValue);
    this.profileInput.nativeElement.value = '';
    this.profilesCtrl.setValue(null);
  }

  addProfiles($event: MatChipInputEvent) {
    const value = ($event?.value || '').trim();

    if (value) {
      this.profiles.push(value);
    }

    $event.chipInput!.clear();

    this.profilesCtrl.setValue(null);
  }
}
