import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClose,
  faFilterCircleXmark,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FilterMetadata, MenuItem, MessageService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { Roles, UserData } from '../../../../core/modules/interfaces';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { UserService } from '../../../../core/services/user/user.service';
import { CustomerService } from './data/costumer-data';

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
    ContextMenuModule,
  ],
  providers: [CustomerService, MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  @ViewChild('f') f!: NgForm;
  @ViewChild('customers') tabela!: Table;

  user = this.storageService.getUser();
  roles?: any;
  searchValue?: string;
  users!: Observable<any>;
  rolesOptions: Roles[] | undefined;
  customers!: UserData[];
  clonedUsers: { [s: string]: UserData } = {};
  selectedCustomers!: UserData;
  loading: boolean = true;
  items: MenuItem[] | undefined;
  showModal: boolean = false;
  isLoginLoading: boolean = false;
  userName = '';

  icons = {
    filter: faFilterCircleXmark,
    closed: faClose,
    search: faMagnifyingGlass,
  };

  allProfiles: string[] = [];

  constructor(
    private customerService: CustomerService,
    private storageService: StorageService,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getInformations();
    this.items = [
      {
        label: 'Excluir',
        command: () => this.openModal(),
      },
    ];
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
      next: (data: any) => {
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

  onRowClick(item: any) {
    console.log(item);
    this.router.navigate(['/admin/users_panel/edit_users'], {
      state: { item: item },
    });
  }

  onRowSelect(event: MouseEvent, customer: any) {
    event.preventDefault();
    this.userName = customer.userName;
    this.selectedCustomers = customer;
  }

  excludeUser() {
    const userId = this.selectedCustomers.id;
    console.log(userId);
    this.isLoginLoading = true;
    setTimeout(() => {
      this.isLoginLoading = false;
    }, 2500);

    if (!this.user || !this.user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.authService.delete(userId, headers).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário ${this.userName} excluído`,
          life: 2500,
        });
        this.closeModal();
        this.getInformations();
        this.isLoginLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro durante a exclusão.',
          life: 2500,
        });
        console.error(err);
      },
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }
}
