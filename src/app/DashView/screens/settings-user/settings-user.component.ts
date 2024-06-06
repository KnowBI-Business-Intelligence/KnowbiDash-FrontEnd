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
import { Roles } from '../../../core/modules/interfaces';
import { AuthService } from '../../../core/services/auth/auth.service';
import { StorageService } from '../../../core/services/user/storage.service';
import { UserService } from '../../../core/services/user/user.service';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';

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
    private storageService: StorageService,
    private userService: UserService,
    private profileService: ProfilesService
  ) {}

  ngOnInit(): void {
    this.rolesOptions = [
      { id: 'user', name: 'Usuário Padrão' },
      { id: 'mod', name: 'Usuário Moderador' },
      { id: 'admin', name: 'Usuário Administrador' },
    ];
    this.getUserData();
    this.getProfiles();
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
      error: (error) => {},
    });
  }

  getProfiles() {
    const user = this.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
    this.profileService.getProfiles(headers).subscribe({
      next: (data: any) => {
        data.map((profileData: any) => {
          profileData.users.map((userData: any) => {
            if (this.infoUsersData!.id == userData.id) {
              this.profiles.push(profileData.name);
            }
          });
        });
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
          return 'Usuário';
      }
    } catch (error) {
      switch (roles) {
        case 'ROLE_ADMIN':
          return 'Administrador';

        case 'ROLE_MOD':
          return 'Moderador';

        default:
          return 'Usuário';
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
