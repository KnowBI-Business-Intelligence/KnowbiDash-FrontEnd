import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { ProfilesService } from '../../../../core/services/profiles/profiles.service';

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

  deleteButton: HTMLElement | null = null;
  seeButton: HTMLElement | null = null;

  user = this.storageService.getUser();
  userId: any;
  selectedRow: any;
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
  actionButton: boolean = false;
  userName = '';

  userToken = this.storageService.getUser();

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.userToken.token}`,
  });

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
    private profile: ProfilesService,
    private authService: AuthService,
    private userService: UserService,
    private elementRef: ElementRef,
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
    this.userService.getUsersInfo({ headers: this.headers }).subscribe({
      next: (data: any) => {
        this.customerService.processUserData(data);
        this.roles = data.roles;

        this.customerService.getCustomersLarge(data).then((users) => {
          this.customers = users;
          this.loading = false;
          this.getProfiles(users);
        });
      },
      error: (error) => {},
    });
  }

  getProfiles(users: UserData[]) {
    users.map((userData: UserData) => {
      this.profile.getProfiles(this.headers).subscribe({
        next: (value) => {
          value.map((profiles: any) => {
            profiles.users.map((profileUserData: any) => {
              if (userData.id == profileUserData.id) {
                const customer = this.customers.find(
                  (c) => c.id === userData.id
                );
                if (customer) {
                  if (!customer.perfis) {
                    customer.perfis = [];
                  }
                  customer.perfis.push(profiles.name);
                }
              }
            });
          });
        },
      });
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
    this.selectedRow = item;
    this.deleteButton =
      this.elementRef.nativeElement.querySelector('#deleteButton');
    this.seeButton = this.elementRef.nativeElement.querySelector('#seeButton');
    this.userId = item.id;
    if (this.deleteButton) {
      this.deleteButton.style.color = '#4f80e1';
    }
    if (this.seeButton) {
      this.seeButton.style.color = '#4f80e1';
    }
  }

  onRowSelect(event: MouseEvent, customer: any) {
    event.preventDefault();
    this.userName = customer.userName;
    this.selectedCustomers = customer;
  }

  excludeUser() {
    const userId = this.selectedRow.id;
    this.isLoginLoading = true;
    setTimeout(() => {
      this.isLoginLoading = false;
    }, 2500);

    if (!this.user || !this.user.token) {
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
      },
    });
  }

  viewProfile() {
    if (this.selectedRow != undefined) {
      this.router.navigate(['/admin/users_panel/edit_users'], {
        state: { item: this.selectedRow },
      });
    }
  }

  openModal(): void {
    if (this.selectedRow != undefined) {
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }
}
