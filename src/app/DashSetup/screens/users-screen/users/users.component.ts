import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClose,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FilterMetadata, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { CustomerService } from '../../../../../assets/data/costumer-data';
import { Roles } from '../../../../../assets/data/roles';
import { UserData } from '../../../../../assets/data/users';
import { AuthService } from '../../../../services/service/auth/auth.service';
import { StorageService } from '../../../../services/service/user/storage.service';
import { UserService } from '../../../../services/service/user/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableModule,
    DropdownModule,
    SliderModule,
    FormsModule,
    CommonModule,
    ToastModule,
    FontAwesomeModule,
    MatListModule,
    RouterModule,
  ],
  providers: [CustomerService, MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  @ViewChild('f') f!: NgForm;
  @ViewChild('customers') tabela!: Table;

  roles?: any;
  statuses!: any[];
  searchValue?: string;
  users!: Observable<any>;
  rolesOptions: Roles[] | undefined;

  customers!: UserData[];
  clonedUsers: { [s: string]: UserData } = {};
  selectedCustomers!: UserData;

  loading: boolean = true;

  icons = {
    filter: faFilterCircleXmark,
    closed: faClose,
  };

  allProfiles: string[] = [
    'Administrador do Sistema',
    'Faturamento',
    'Recepção',
    'Farmácia',
    'Médico',
  ];

  constructor(
    private customerService: CustomerService,
    private storageService: StorageService,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getInformations();

    this.rolesOptions = [
      { id: 'user', name: 'Usuário Padrão' },
      { id: 'admin', name: 'Usuário Administrador' },
    ];
  }

  getInformations() {
    const user = this.storageService.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.userService.getUsersInfo({ headers: headers }).subscribe({
      next: (data) => {
        this.customerService.processUserData(data);
        this.roles = data.roles;

        this.customerService.getCustomersLarge(data).then((users) => {
          this.customers = users;
          this.loading = false;
        });
      },
      error: (error) => {
        console.error('ErrgetInformations:', error);
      },
    });
  }

  clear(table: Table): void {
    table.clear();
    this.searchValue = '';
  }

  onInputChange(event: any, table: Table): void {
    if (event.target instanceof HTMLInputElement) {
      const inputValue: string = event.target.value;

      if (inputValue.trim() !== '') {
        const customFilter: FilterMetadata = {
          value: inputValue,
          matchMode: 'contains',
        };

        const filters: { [s: string]: FilterMetadata } = {};

        for (const field of table.globalFilterFields!) {
          filters[field] = customFilter;
        }

        table.filterGlobal(inputValue, 'contains');
      } else {
        this.clear(table);
      }
    }
  }

  getRoles(roles: string): string {
    try {
      switch (roles) {
        case 'ROLE_ADMIN':
          return 'Administrador';

        case 'ROLE_MODERATOR':
          return 'Moderador';

        default:
          return 'Padrão';
      }
    } catch (error) {
      throw error;
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
}
