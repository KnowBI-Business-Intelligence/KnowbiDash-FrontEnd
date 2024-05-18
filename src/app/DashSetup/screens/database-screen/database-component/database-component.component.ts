import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { BreadrumbsService } from '../../../../core/services/breadcrumb/breadrumbs.service';
import { DatabaseConnectionService } from '../../../../core/services/database/database-connection.service';

@Component({
  selector: 'app-database-component',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    ToastModule,
    RouterModule,
  ],
  providers: [MessageService, BreadrumbsService],
  templateUrl: './database-component.component.html',
  styleUrl: './database-component.component.css',
})
export class DatabaseComponentComponent {
  @ViewChild('f') f!: NgForm;

  form: any = {
    username: null,
    password: null,
    URL: null,
  };

  isConected: any;
  showForm!: boolean;
  isLoginLoading: boolean = false;

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
    private database: DatabaseConnectionService
  ) {
    if (this.isConected === true) {
      this.showForm = false;
    }
  }

  connectDatabase() {
    const that = this;
    this.isLoginLoading = true;
    const { url, username, password } = this.form;

    this.database.connection(url, username, password).subscribe({
      next: (data) => {
        that.messageService.add({
          summary: 'Sucesso',
          detail: `Conectado a base de dados`,
          severity: 'success',
        });
        that.f.reset();
        that.isConected = true;
        this.isLoginLoading = false;
      },
      error: (err) => {
        this.isLoginLoading = false;
        that.messageService.add({
          summary: 'Erro',
          detail: err.error.erro,
          severity: 'error',
        });
      },
    });
  }
}
