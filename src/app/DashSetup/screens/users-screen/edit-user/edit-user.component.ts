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
  styleUrl: '../create-user/create-user.component.css',
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
  userId: any;
  user = this.storageService.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

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
    console.log(this.item);
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
    console.log('teste');
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
    }, 2000);

    const {
      fullusername,
      username,
      password,
      email,
      occupation,
      access_level,
    } = this.form;

    const profileIds = this.profileIds.map((profileIds) => profileIds);
    console.log(profileIds);

    const userData = {
      fullUserName: fullusername,
      cargo: occupation,
      email: email,
      userName: username,
      passWord: password,
      roles: [access_level],
      perfis: profileIds,
    };

    console.log(userData);

    this.authService.edit(id, userData, this.headers).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário Atualizado',
        });
        setTimeout(() => {
          this.router.navigate(['/admin/users_panel']);
          this.isLoginLoading = false;
        }, 2000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            'Ocorreu um erro durante a atualização, verifique os campos preenchidos',
        });
        console.error(err);
      },
    });
  }

  loadUserData(id: number) {
    this.authService.getById(id, this.headers).subscribe({
      next: (userData: any) => {
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
      },
      error: (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
      },
    });
  }

  getProfiles() {
    this.profileService.getProfiles(this.headers).subscribe({
      next: (data: any) => {
        data.map((profileData: any) => {
          profileData.users.map((userData: any) => {
            if (this.item.id == userData.id) {
              this.profiles.push(profileData.name);
              this.profileIds.push(profileData.id);
            }
          });
        });
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
