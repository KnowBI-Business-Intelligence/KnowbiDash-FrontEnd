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
import { BreadrumbsService } from '../../../../services/service/breadcrumb/breadrumbs.service';
import { DatabaseConnectionService } from '../../../../services/service/database/database-connection.service';

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

    const { url, username, password } = this.form;

    this.database.connection(url, username, password).subscribe({
      next() {
        that.messageService.add({
          summary: 'Sucesso!',
          detail: 'Banco de dados configurado',
          severity: 'success',
        });
        that.f.reset();
        that.isConected = true;
      },
      error(err) {
        that.messageService.add({
          summary: 'Erro!',
          detail: 'Banco de dados não configurado',
          severity: 'error',
        });
        console.error(err);
      },
    });
  }
}
