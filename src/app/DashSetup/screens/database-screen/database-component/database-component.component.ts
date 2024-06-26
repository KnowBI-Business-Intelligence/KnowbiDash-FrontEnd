import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faBars,
  faDatabase,
  faStar,
  faUserGear,
  faXmark,
  faTrash,
  faPenToSquare,
  faPlug,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderListModule } from 'primeng/orderlist';
import { Connections } from '../domain/connections-interfaces';
import { DividerModule } from 'primeng/divider';
import { ProductService } from '../service/ProductService';
import { BreadrumbsService } from '../../../../core/services/breadcrumb/breadrumbs.service';
import { DatabaseConnectionService } from '../../../../core/services/database/database-connection.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-database-component',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    ToastModule,
    RouterModule,
    OrderListModule,
    DividerModule,
    ReactiveFormsModule,
    SkeletonModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService, BreadrumbsService, ProductService],
  templateUrl: './database-component.component.html',
  styleUrls: [
    './database-component.component.css',
    '../../../../core/globalStyle/toast.css',
  ],
})
export class DatabaseComponentComponent implements OnInit {
  @ViewChild('f') f!: NgForm;

  connections!: Connections[];

  form = this.formBuilder.group({
    dbname: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    service: ['', Validators.required],
  });

  connectbtn: HTMLElement | null = null;
  isConected: any;
  databaseId: any;
  showForm: boolean = true;
  isLoginLoading: boolean = false;
  isAdding: boolean = false;
  isDeleteModal: boolean = false;
  isLoadingConnectionContent: boolean = true;

  dbname!: string;
  username!: string;
  password!: string;
  service!: string;

  userToken = this.storageService.getUser();

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.userToken.token}`,
  });

  icons = {
    menu: faBars,
    favorite: faStar,
    user: faUserGear,
    logout: faArrowRightFromBracket,
    database: faDatabase,
    close: faXmark,
    delete: faTrash,
    edit: faPenToSquare,
    connect: faPlug,
    play: faPlay,
  };

  constructor(
    private messageService: MessageService,
    private database: DatabaseConnectionService,
    private productService: ProductService,
    private storageService: StorageService,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder
  ) {
    if (this.isConected === true) {
      this.showForm = false;
    }
  }

  ngOnInit() {
    this.callConnections();
  }

  callConnections() {
    this.isLoadingConnectionContent = true;
    this.productService.getDataBasesConnections().subscribe({
      next: (value) => {
        this.connections = value;
        console.log(this.connections);
        setTimeout(() => {
          this.isLoadingConnectionContent = false;
        }, 1500);
      },
      error: (err) => {
        console.error('Error fetching connections:', err);
      },
    });
  }

  addToList() {
    this.isAdding = true;
    this.form.reset();
  }

  cancelAdd() {
    this.isAdding = false;
    this.callConnections();
  }

  getData() {
    this.dbname = this.form.get('dbname')?.value as string;
    this.username = this.form.get('username')?.value as string;
    this.password = this.form.get('password')?.value as string;
    this.service = this.form.get('service')?.value as string;
  }

  createConnection() {
    this.getData();

    const dbInfo = {
      dbname: this.dbname,
      username: this.username,
      password: this.password,
      service: this.service,
    };

    if (!this.dbname || !this.username || !this.password || !this.service) {
      this.warnMessageToast('Por favor, preencha todos os campos.');
      return;
    } else {
      console.log(JSON.stringify(dbInfo, null, 2));
      this.database.createDataBases(this.headers, dbInfo).subscribe({
        next: (value) => {
          this.isAdding = false;
          this.callConnections();
          console.log(value);
          this.successMessageToast('Base de dados adicionada');
        },
        error: (err) => {
          console.log(err);
          this.errorMessageToast('Ocorreu um erro ao inserir a base de dados');
        },
      });
    }
  }

  connectDatabase(connections: any) {
    this.connectbtn =
      this.elementRef.nativeElement.querySelector('.connect-button');
    this.connectbtn!.style.backgroundColor = '#fff';
    connections.isLoading = true;

    const dbInfo = {
      username: connections.username,
      password: connections.password,
      url: connections.service,
    };

    console.log(dbInfo);

    this.database.connection(this.headers, dbInfo).subscribe({
      next: (data) => {
        this.successMessageToast(
          `Conectado a base de dados ${connections.dbname}`
        );
        this.isConected = true;
        connections.isLoading = false;
      },
      error: (err) => {
        connections.isLoading = false;
        this.errorMessageToast(err.error.erro);
      },
    });
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  formatPassword(password: string): string {
    return '•'.repeat(password.length);
  }

  callDeleteModal(id: string) {
    this.databaseId = id;
    console.log(this.databaseId);
    this.isDeleteModal = true;
  }

  cancelDelete() {
    this.isDeleteModal = false;
  }

  confirmDelete() {
    this.database.deleteDataBases(this.headers, this.databaseId).subscribe({
      next: (value) => {
        this.successMessageToast('Base de dados excluída');
        this.isDeleteModal = false;
        this.callConnections();
      },
      error: (err) => {
        this.errorMessageToast(
          'Ocorreu um erro ao tentar excluir a base de dados'
        );
      },
    });
  }

  errorMessageToast(message: string) {
    return this.messageService.add({
      severity: 'error',
      detail: message,
    });
  }

  warnMessageToast(message: string) {
    return this.messageService.add({
      severity: 'warn',
      detail: message,
    });
  }

  successMessageToast(message: string) {
    return this.messageService.add({
      severity: 'success',
      detail: message,
    });
  }
}
