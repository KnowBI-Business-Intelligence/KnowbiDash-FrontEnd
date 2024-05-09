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
import { Message, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { map, Observable, startWith } from 'rxjs';
import { Roles } from '../../../../core/modules/interfaces';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ProfilesService } from '../../../../core/services/profiles/profiles.service';
import { StorageService } from '../../../../core/services/user/storage.service';

@Component({
  selector: 'app-create-user',
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
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  @ViewChild('f') f!: NgForm;
  @ViewChild('profileInput') profileInput!: ElementRef<HTMLInputElement>;

  messages: Message[] = [];

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
    profiles: [],
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredProfiles!: Observable<string[]>;
  profiles: string[] = [];
  profileIds: string[] = [];
  allProfiles: { name: string; id: string }[] = [];
  profilesCtrl = new FormControl('');
  announcer = inject(LiveAnnouncer);

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

  ngOnInit(): void {
    this.getProfiles();
    this.rolesOptions = [
      { id: 'user', name: 'Usuário Padrão' },
      { id: 'admin', name: 'Usuário Administrador' },
    ];
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

  onSubmit() {
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

    const user = this.storageService.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    const profileIds = this.profileIds.map((profileIds) => profileIds);

    const userData = {
      fullUserName: fullusername,
      cargo: occupation,
      email: email,
      userName: username,
      passWord: password,
      roles: [access_level.id],
      perfis: profileIds,
    };
    this.authService.registerUser(headers, userData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário Cadastrado!',
        });
        this.f.reset();
        setTimeout(() => {
          this.router.navigate(['/admin/users_panel']);
          this.isLoginLoading = false;
        }, 2500);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro durante o cadastro do usuário.',
        });
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
