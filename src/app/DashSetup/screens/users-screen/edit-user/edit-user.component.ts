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

  allProfiles: string[] = ['Administração do Sistema', 'Faturamento'];

  profilesCtrl = new FormControl('');

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.filteredProfiles = this.profilesCtrl.valueChanges.pipe(
      startWith(null),
      map((profile: string | null) =>
        profile ? this._filter(profile) : this.allProfiles.slice()
      )
    );
  }

  ngOnInit(): void {
    this.item = this.router.getCurrentNavigation()?.extras.state?.['item'];
    console.log(this.item);

    this.rolesOptions = [
      { id: 'user', name: 'Usuário Padrão' },
      { id: 'admin', name: 'Usuário Administrador' },
    ];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allProfiles.filter((profiles) =>
      profiles.toLowerCase().includes(filterValue)
    );
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
    this.profiles.push($event.option.viewValue);
    this.profileInput.nativeElement.value = '';
    this.profilesCtrl.setValue(null);
  }

  addProfiles($event: MatChipInputEvent) {
    const value = ($event?.value || '').trim();

    if (this.allProfiles.includes(value)) {
      this.profiles.push(value);
    }

    $event.chipInput!.clear();

    this.profilesCtrl.setValue(null);
  }

  removeProfile(profile: any) {
    const index = this.profiles.indexOf(profile);

    if (index >= 0) {
      this.profiles.splice(index, 1);

      this.announcer.announce(`Removed ${profile}`);
    }
  }

  onSubmit() {
    this.editUser();
  }

  private editUser() {
    const {
      fullusername,
      username,
      password,
      email,
      occupation,
      access_level,
      profiles,
    } = this.form;

    const user = this.storageService.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.authService
      .edit(
        this.item?.id,
        !username ? this.item?.userName : username,
        !occupation ? this.item?.cargo : occupation,
        !email ? this.item?.email : email,
        !fullusername ? this.item?.fullUserName : fullusername,
        !password ? this.item?.password : password,
        !access_level
          ? this.getRolesUp(this.item?.roles?.[0])
          : access_level.id,
        profiles,
        headers
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário Atualizado!',
          });

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
}

// onDeleteDelete() {
//   const isAdmin = this.infoUsersUserSession.roles[0];

//   if (isAdmin === 'ROLE_ADMIN') {
//     const user = this.storageService.getUser();

//     if (!user || !user.token) {
//       console.error('Token não disponível');
//       return;
//     }

//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${user.token}`,
//     });

//     this.authService.delete(this.infoUsersData?.id, headers).subscribe({
//       next: () => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Sucesso',
//           detail: 'Usuário Excluído!',
//         });
//         this.buttonDeleteCancel = !this.buttonDeleteCancel;
//         this.buttonDeleteDelete = !this.buttonDeleteDelete;
//         this.buttonEdit = !this.buttonEdit;
//         this.buttonDelete = !this.buttonDelete;
//         this.tabela.reset();
//       },
//       error: (err) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Erro',
//           detail: 'Ocorreu um erro durante a ooperação.',
//         });
//         console.error(err);
//       },
//     });
//   } else {
//     window.alert('não adm');
//   }
// }
