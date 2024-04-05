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
import { RouterModule } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { map, Observable, startWith } from 'rxjs';
import { Roles } from '../../../../../assets/data/roles';
import { AuthService } from '../../../../services/service/auth/auth.service';
import { StorageService } from '../../../../services/service/user/storage.service';

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

  announcer = inject(LiveAnnouncer);

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private messageService: MessageService
  ) {
    this.filteredProfiles = this.profilesCtrl.valueChanges.pipe(
      startWith(null),
      map((profile: string | null) =>
        profile ? this._filter(profile) : this.allProfiles.slice()
      )
    );
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

    if (this.allProfiles.includes(value)) {
      this.profiles.push(value);
    }

    $event.chipInput!.clear();

    this.profilesCtrl.setValue(null);
  }

  ngOnInit(): void {
    this.rolesOptions = [
      { id: 'user', name: 'Usuário Padrão' },
      { id: 'admin', name: 'Usuário Administrador' },
    ];
  }

  removeProfile(profile: any) {
    const index = this.profiles.indexOf(profile);

    if (index >= 0) {
      this.profiles.splice(index, 1);

      this.announcer.announce(`Removed ${profile}`);
    }
  }

  onSubmit() {
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
      .register(
        username,
        occupation,
        email,
        fullusername,
        password,
        access_level.id,
        profiles,
        headers
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário Cadastrado!',
          });
          this.f.reset();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro durante o cadastro do usuário.',
          });
          console.error(err);
        },
      });
  }
}
