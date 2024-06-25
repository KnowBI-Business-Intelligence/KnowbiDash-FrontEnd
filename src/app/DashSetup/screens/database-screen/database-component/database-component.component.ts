import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faBars,
  faDatabase,
  faStar,
  faUserGear,
  faXmark,
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

  form: any = {
    username: null,
    password: null,
    URL: null,
  };

  isConected: any;
  showForm!: boolean;
  isLoginLoading: boolean = false;

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
  };

  constructor(
    private messageService: MessageService,
    private database: DatabaseConnectionService,
    private productService: ProductService,
    private storageService: StorageService
  ) {
    if (this.isConected === true) {
      this.showForm = false;
    }
  }

  ngOnInit() {
    this.productService.getDataBasesConnections().subscribe({
      next: (value) => {
        this.connections = value;
        console.log(this.connections);
      },
      error: (err) => {
        console.error('Error fetching connections:', err);
      },
    });
  }

  connectDatabase() {
    const that = this;
    this.isLoginLoading = true;
    const { url, username, password } = this.form;

    this.database.connection(url, username, password, this.headers).subscribe({
      next: (data) => {
        that.messageService.add({
          detail: `Conectado a base de dados`,
          severity: 'success',
        });
        that.isConected = true;
        this.isLoginLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoginLoading = false;
        that.messageService.add({
          detail: err.error.erro,
          severity: 'error',
        });
      },
    });
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  formatPassword(password: string): string {
    return '•'.repeat(password.length);
  }
}
