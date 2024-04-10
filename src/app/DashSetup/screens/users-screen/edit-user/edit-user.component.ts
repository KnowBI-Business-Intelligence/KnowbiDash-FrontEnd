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
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { map, Observable, startWith } from 'rxjs';
import { Roles } from '../../../../../assets/data/roles';
import { AuthService } from '../../../../services/service/auth/auth.service';
import { StorageService } from '../../../../services/service/user/storage.service';
import { ActivatedRoute } from '@angular/router';
import { ProfilesService } from '../../../../services/service/profiles/profiles.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    RouterModule,
  ],
  providers: [MessageService],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  @ViewChild('f') f!: NgForm;
  @ViewChild('profileInput') profileInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  item: any;
  rolesOptions: Roles[] | undefined;
  role: Roles | undefined;
  isLoginLoading: boolean = false;
  form: any = {
    fullusername: null,
    username: null,
    password: null,
    email: null,
    occupation: null,
    access_levels: null,
    profiles: null,
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredProfiles!: Observable<string[]>;
  profiles: string[] = [];
  profileIds: string[] = [];
  allProfiles: { name: string; id: string }[] = [];
  profilesCtrl = new FormControl('');
  user = this.storageService.getUser();

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private messageService: MessageService,
    private profileService: ProfilesService,
    private router: Router
  ) {
    this.filteredProfiles = this.profilesCtrl.valueChanges.pipe(
      startWith(null),
      map((profile: string | null) =>
        profile
          ? this._filter(profile)
          : this.allProfiles.map((profile) => profile.name)
      )
    );
  }

  ngOnInit(): void {
    this.item = history.state.item;
    this.loadUserData(this.item.id);
    this.getProfiles();
    this.rolesOptions = [
      { id: 'user', name: 'Usuário Padrão' },
      { id: 'admin', name: 'Usuário Administrador' },
    ];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allProfiles
      .map((profile) => profile.name)
      .filter((name) => name.toLowerCase().includes(filterValue));
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

  getRoles(roles: string): string {
    try {
      switch (roles) {
        case 'ROLE_ADMIN':
          return 'Usuário Administrador';

        case 'ROLE_MODERATOR':
          return 'Usuário Moderador';

        default:
          return 'Usuário Padrão';
      }
    } catch (error) {
      throw error;
    }
  }

  selectedProfiles($event: MatAutocompleteSelectedEvent) {
    const selectedProfile = this.allProfiles.find(
      (profile) => profile.name === $event.option.viewValue
    );
    if (selectedProfile) {
      if (!this.profiles.includes(selectedProfile.name)) {
        this.profiles.push(selectedProfile.name);
        this.profileIds.push(selectedProfile.id);
      }
      console.log(this.profiles);
      console.log('id ', this.profileIds);
      const index = this.allProfiles.findIndex(
        (profile) => profile.name === selectedProfile.name
      );
      if (index !== -1) {
        this.allProfiles.splice(index, 1);
      }
    }
    this.profileInput.nativeElement.value = '';
    this.profilesCtrl.setValue(null);
  }

  addProfiles($event: MatChipInputEvent) {
    const value = ($event?.value || '').trim();

    $event.chipInput!.clear();

    this.profilesCtrl.setValue(null);
  }

  removeProfile(profile: any) {
    const index = this.profiles.indexOf(profile);

    if (index >= 0) {
      const removedProfile = this.profiles.splice(index, 1)[0];
      const removedProfileId = this.profileIds.splice(index, 1)[0];

      const removedProfileObject = {
        name: removedProfile,
        id: removedProfileId,
      };

      this.allProfiles.push(removedProfileObject);

      console.log(
        `Perfil removido: ${removedProfile}, ID: ${removedProfileId}`
      );

      console.log('adicionado a todos os perfis', removedProfileObject);

      this.announcer.announce(`Removed ${profile}`);

      this.filteredProfiles = this.profilesCtrl.valueChanges.pipe(
        startWith(null),
        map((profile: string | null) =>
          profile
            ? this._filter(profile)
            : this.allProfiles.map((profile) => profile.name)
        )
      );
    }
  }

  onSubmit() {
    console.log(this.item.id);
    this.editUser(this.item.id);
  }

  private editUser(id: number) {
    this.isLoginLoading = true;
    setTimeout(() => {
      this.isLoginLoading = false;
    }, 2500);

    if (this.areRequiredFieldsEmpty()) {
      this.isLoginLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: '',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    const {
      fullusername,
      username,
      password,
      email,
      occupation,
      access_level,
    } = this.form;

    if (!this.user || !this.user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    const profileIds = this.profileIds.map((profileIds) => profileIds);
    console.log(profileIds);

    const userData = {
      fullUserName: fullusername,
      cargo: occupation,
      email: email,
      userName: username,
      passWord: password,
      roles: [access_level.id],
      perfis: profileIds,
    };

    this.authService.edit(id, userData, headers).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário Atualizado!',
        });
        setTimeout(() => {
          this.router.navigate(['/admin/users_panel']);
          this.isLoginLoading = false;
        }, 2500);
        this.f.reset();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro durante a atualização.',
        });
        console.error(err);
      },
    });
  }

  loadUserData(id: number) {
    if (!this.user || !this.user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    console.log(headers);
    this.authService.getById(id, headers).subscribe({
      next: (userData) => {
        console.log(userData);
        this.form.fullusername = userData.fullUserName;
        this.form.username = userData.userName;
        this.form.password = userData.password;
        this.form.email = userData.email;
        this.form.occupation = userData.cargo;
        if (userData.perfis && userData.perfis.length > 0) {
          this.profiles = userData.perfis.map((perfil: any) => perfil.name);
        } else {
          this.profiles = [];
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
      },
    });
  }

  getProfiles() {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.profileService.getProfiles(headers).subscribe({
      next: (data) => {
        this.allProfiles = data.map((item: any) => ({
          name: item.name,
          id: item.id,
        }));
        console.log(this.allProfiles);

        this.filteredProfiles = this.profilesCtrl.valueChanges.pipe(
          startWith(null),
          map((profile: string | null) =>
            profile
              ? this._filter(profile)
              : this.allProfiles.map((profile) => profile.name)
          )
        );
      },
    });
  }

  areRequiredFieldsEmpty(): boolean {
    const requiredFields = [
      'fullusername',
      'username',
      'password',
      'access_level',
    ];
    for (const key of requiredFields) {
      if (
        this.form[key] === null ||
        this.form[key] === undefined ||
        this.form[key] === ''
      ) {
        return true;
      }
    }
    return false;
  }

  backScreen() {
    this.router.navigate(['/admin/users_panel']);
  }
}
