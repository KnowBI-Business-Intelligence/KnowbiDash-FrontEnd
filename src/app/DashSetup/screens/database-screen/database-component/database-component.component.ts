import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
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
  faDatabase,
  faXmark,
  faTrashCan,
  faPenToSquare,
  faPlug,
  faPlay,
  faServer,
  faMinus,
  faPause,
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
import { Subscription, interval } from 'rxjs';

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
    id: ['', Validators.required],
    dbname: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    service: ['', Validators.required],
  });

  formEdit = this.formBuilder.group({
    id: ['', Validators.required],
    dbname: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    service: ['', Validators.required],
  });

  isConected: any;
  databaseId: any;
  formEditRequest: any;
  showForm: boolean = true;
  isConnectionLoading: boolean = false;
  isConnectingDbName: string = 'Aguardando conexão...';
  isAdding: boolean = false;
  isEditing: boolean = false;
  isDeleteModal: boolean = false;
  isDisconnected: boolean = true;
  isListNotNull: boolean = true;
  isLoadingConnectionContent: boolean = true;
  public activeConnectionId: string | null = null;
  private intervalSubscription!: Subscription;

  id!: string;
  dbname!: string;
  username!: string;
  password!: string;
  service!: string;

  connectedDbName!: string;
  connectedService!: string;

  userToken = this.storageService.getUser();

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.userToken.token}`,
  });

  icons = {
    database: faDatabase,
    close: faXmark,
    delete: faTrashCan,
    edit: faPenToSquare,
    connect: faPlug,
    play: faPlay,
    server: faServer,
    minus: faMinus,
    stop: faPause,
  };

  constructor(
    private messageService: MessageService,
    private database: DatabaseConnectionService,
    private productService: ProductService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone
  ) {
    if (this.isConected === true) {
      this.showForm = false;
    }
  }

  ngOnInit() {
    this.callConnections();
    this.database.disconnectionSuccessful$.subscribe(() => {
      this.callConnections();
      this.showForm = true;
    });
  }

  callConnections() {
    this.isLoadingConnectionContent = true;
    this.initDataConnections();
  }

  initDataConnections() {
    this.productService.getDataBasesConnections().subscribe({
      next: (value) => {
        this.connections = value;
        console.log(this.connections.length);
        if (this.connections.length > 0) {
          this.isListNotNull = true;
        } else {
          this.isListNotNull = false;
        }
        this.sortConnections();
        setTimeout(() => {
          this.isLoadingConnectionContent = false;
        }, 1300);
        this.ngZone.run(() => {
          this.connections = [...this.connections];
        });
        this.initConnectedOrNot(value);
      },
    });
  }

  initConnectedOrNot(value: any) {
    value.map((data: any) => {
      if (data.connected) {
        this.activeConnectionId = data.id;
        this.connectedDbName = data.dbname;
        this.connectedService = data.service;
        this.showForm = false;
      }
    });
  }

  getDisabledState(connection: any): boolean {
    if (connection.connected) {
      return false;
    } else {
      return this.connections.some((conn) => conn.connected);
    }
  }

  createConnection() {
    this.getData();
    const dbInfo = {
      dbname: this.dbname,
      username: this.username,
      password: this.password,
      service: this.service,
      connected: false,
    };

    if (!this.dbname || !this.username || !this.password || !this.service) {
      this.warnMessageToast('Por favor, preencha todos os campos.');
      return;
    } else {
      this.database.createDataBases(this.headers, dbInfo).subscribe({
        next: (value) => {
          this.isAdding = false;
          this.callConnections();
          this.successMessageToast('Base de dados adicionada');
        },
        error: (err) => {
          this.errorMessageToast('Ocorreu um erro ao inserir a base de dados');
        },
      });
    }
  }

  editConnection() {
    this.getEditData();
    if (!this.getEditData()) {
      this.warnMessageToast('Por favor, preencha todos os campos.');
      return;
    } else {
      this.database
        .updateDataBases(this.headers, this.formEditRequest, this.databaseId)
        .subscribe({
          next: (value) => {
            this.isEditing = false;
            this.successMessageToast(
              `A base de dados '${this.dbname}' foi atualizada`
            );
            this.databaseId = '';
            this.callConnections();
          },
          error: (err) => {
            this.errorMessageToast(
              'Ocorreu um erro ao atualizar a base de dados'
            );
          },
        });
    }
  }

  editConnectionById(connection: boolean, id: any) {
    const connectiondb = {
      connected: connection,
    };
    this.database.updateDataBases(this.headers, connectiondb, id).subscribe({
      next: (value) => {},
    });
  }

  connectDatabase(connections: any) {
    this.isConnectionLoading = true;
    connections.isLoading = true;
    this.isConnectingDbName = connections.dbname;
    this.activeConnectionId = connections.id;

    const dbInfo = {
      username: connections.username,
      password: connections.password,
      url: connections.service,
    };

    this.database.connection(this.headers, dbInfo).subscribe({
      next: (data) => {
        this.successMessageToast(
          `Conectado a base de dados '${connections.dbname}'`
        );
        this.isConected = true;
        this.isConnectionLoading = false;
        this.showForm = false;
        connections.isLoading = false;
        connections.isConnected = true;
        this.activeConnectionId = connections.id;
        this.sortConnections();
        this.editConnectionById(true, this.activeConnectionId);
        setTimeout(() => {
          this.initDataConnections();
          this.database.notifyConnectionSuccessful();
        }, 300);

        this.intervalSubscription = interval(35000).subscribe(() => {
          this.getConnectionDatabase(connections);
        });

        this.ngZone.run(() => {
          this.connections = [...this.connections];
        });
      },
      error: (err) => {
        connections.isLoading = false;
        connections.isConnected = false;
        this.isConnectionLoading = false;
        this.isConnectingDbName = `Tentativa de conectar a <strong>${connections.dbname}</strong>:<br>${err.error.erro}`;
        this.errorMessageToast(err.error.erro);
        this.activeConnectionId = null;
      },
    });
  }

  getConnectionDatabase(connections: any) {
    this.database.getConnection(this.headers).subscribe({
      next: (value) => {
        const response = value as { isConnected: boolean; error: string };
        if (response.isConnected == false) {
          if (this.intervalSubscription) {
            this.intervalSubscription.unsubscribe();
          }
          this.warnMessageToast(
            'A conexão com a base de dados foi perdida, desconectando...'
          );
          this.disconnectDatabaseLoseConnection(connections);
        }
      },
    });
  }

  disconnectDatabaseLoseConnection(connections: any) {
    connections.isLoading = true;
    this.database.desconnectionAll(this.headers).subscribe({
      next: (value) => {
        this.isConnectingDbName = 'Aguardando conexão...';
        this.warnMessageToast('A base de dados foi desconectada');
        connections.isLoading = false;
        connections.isConnected = false;
        this.activeConnectionId = null;
        this.showForm = true;
        this.sortConnections();
        this.editConnectionById(false, connections.id);
        setTimeout(() => {
          this.initDataConnections();
        }, 300);

        this.ngZone.run(() => {
          this.connections = [...this.connections];
        });
      },
    });
  }

  disconnectDatabase(connections: any) {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    connections.isLoading = true;
    this.database.desconnection(this.headers).subscribe({
      next: (data) => {
        this.isConnectingDbName = 'Aguardando conexão...';
        this.successMessageToast(
          `Desconectado da base de dados '${connections.dbname}'`
        );
        connections.isLoading = false;
        connections.isConnected = false;
        this.activeConnectionId = null;
        this.showForm = true;
        this.sortConnections();
        this.editConnectionById(false, connections.id);
        setTimeout(() => {
          this.initDataConnections();
          this.database.notifyConnectionSuccessful();
        }, 300);

        this.ngZone.run(() => {
          this.connections = [...this.connections];
        });
      },
      error: (err) => {
        this.errorMessageToast(err.error.error);
        this.disconnectDatabaseLoseConnection(connections);
        connections.isLoading = false;
        connections.isConnected = false;
      },
    });
  }

  sortConnections() {
    this.connections.sort((a, b) => {
      return (b.connected ? 1 : 0) - (a.connected ? 1 : 0);
    });
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
    this.databaseId = '';
  }

  addToList() {
    this.isAdding = true;
    this.form.reset();
  }

  editDatabase(connections: any) {
    this.isEditing = true;
    this.formEdit.patchValue({
      id: connections.id,
      dbname: connections.dbname,
      username: connections.username,
      password: connections.password,
      service: connections.service,
    });
  }

  getData() {
    this.id = this.form.get('id')?.value as string;
    this.dbname = this.form.get('dbname')?.value as string;
    this.username = this.form.get('username')?.value as string;
    this.password = this.form.get('password')?.value as string;
    this.service = this.form.get('service')?.value as string;
  }

  getEditData(): boolean {
    const id = this.formEdit.get('id')?.value as string;
    const dbname = this.formEdit.get('dbname')?.value;
    const username = this.formEdit.get('username')?.value;
    const password = this.formEdit.get('password')?.value;
    const service = this.formEdit.get('service')?.value;

    if (!id || !dbname || !username || !password || !service) {
      return false;
    }

    this.databaseId = id;
    this.dbname = dbname;

    this.formEditRequest = {
      dbname: dbname,
      username: username,
      password: password,
      service: service,
    };

    return true;
  }

  cancelAdd() {
    this.isAdding = false;
    this.isEditing = false;
    this.callConnections();
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  formatPassword(password: string): string {
    return '•'.repeat(password.length);
  }

  callDeleteModal(id: string) {
    this.databaseId = id;
    this.isDeleteModal = true;
  }

  cancelDelete() {
    this.isDeleteModal = false;
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
