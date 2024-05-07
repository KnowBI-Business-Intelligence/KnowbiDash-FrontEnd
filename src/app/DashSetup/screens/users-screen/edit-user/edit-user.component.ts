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
import { Roles } from '../../../../core/modules/interfaces';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ProfilesService } from '../../../../core/services/profiles/profiles.service';
import { StorageService } from '../../../../core/services/user/storage.service';

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
  placeholder: string = '';
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

  selectedProfiles($event: MatAutocompleteSelectedEvent) {
    const selectedProfile = this.allProfiles.find(
      (profile) => profile.name === $event.option.viewValue
    );
    if (selectedProfile) {
      if (!this.profiles.includes(selectedProfile.name)) {
        this.profiles.push(selectedProfile.name);
        this.profileIds.push(selectedProfile.id);
      }
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
      throw new Error('Token não disponível');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    const profileIds = this.profileIds.map((profileIds) => profileIds);

    const userData = {
      fullUserName: fullusername,
      cargo: occupation,
      email: email,
      userName: username,
      passWord: password,
      roles: [access_level],
      perfis: profileIds,
    };

    this.authService.editUser(headers, id, userData).subscribe({
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
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro durante a atualização.',
        });
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

    this.authService.getUserById(headers, id).subscribe({
      next: (userData: any) => {
        console.log(userData);
        this.form.fullusername = userData.fullUserName;
        this.form.username = userData.userName;
        this.form.password = userData.password;
        this.form.email = userData.email;
        this.form.occupation = userData.cargo;
        this.placeholder = userData.roles[0].name;

        if (this.placeholder == 'ROLE_USER') {
          this.placeholder = 'Usuário Padrão';
          this.form.access_level = 'user';
        } else if (this.placeholder == 'ROLE_ADMIN') {
          this.placeholder = 'Usuário Administrador';
          this.form.access_level = 'admin';
        }

        if (userData.perfis && userData.perfis.length > 0) {
          this.profiles = userData.perfis.map((perfil: any) => perfil.name);
          this.profileIds = userData.perfis.map((perfil: any) => perfil.id);
        } else {
          this.profiles = [];
          this.profileIds = [];
        }
        console.log(this.form.access_level);
      },
      error: (error: Error) => {
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
      next: (data: any) => {
        this.allProfiles = data.map((item: any) => ({
          name: item.name,
          id: item.id,
        }));

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
