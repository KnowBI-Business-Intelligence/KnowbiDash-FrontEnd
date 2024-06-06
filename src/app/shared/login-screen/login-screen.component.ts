import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth/auth.service';
import { StorageService } from '../../core/services/user/storage.service';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessagesModule,
    RouterModule,
    ToastModule,
    BreadcrumbsComponent,
    BreadcrumbModule,
    DialogModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css',
})
export class LoginScreenComponent implements OnInit {
  isADM!: boolean;
  isLoading: boolean = true;
  isModal: boolean = true;
  visible: boolean = false;
  isLoginLoading: boolean = false;

  form: any = {
    username: null,
    password: null,
  };

  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private routes: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.storageService.getToken()) {
      this.roles = this.storageService.getUser().roles;
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  showDialog() {
    this.visible = true;
  }

  defaultOrAdm(isAdmin: boolean): void {
    if (isAdmin) {
      this.redirectUser(isAdmin);
    } else {
      this.redirectUser(isAdmin);
    }
  }

  redirectUser(isAdmin: boolean): void {
    if (isAdmin == true) {
      setTimeout(() => {
        this.routes.navigate(['admin']);
        this.isLoginLoading = false;
      }, 1000);
    } else if (isAdmin == false) {
      setTimeout(() => {
        this.routes.navigate(['content']);
        this.isLoginLoading = false;
      }, 1000);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    this.isLoginLoading = true;
    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveToken(data.token);
        this.storageService.saveRefreshToken(data.refreshToken);
        this.storageService.saveUser(data);
        this.roles = this.storageService.getUser().roles;
        if (this.roles.includes('ROLE_ADMIN')) {
          setTimeout(() => {
            this.isLoginLoading = false;
            this.isModal = false;
          }, 1000);
        } else {
          setTimeout(() => {
            this.routes.navigate(['content']);
            this.isLoginLoading = false;
          }, 1000);
        }
      },
      error: (err) => {
        this.isLoginLoading = false;
        if (!username || !password) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Por favor, preencha os campos Usuário e Senha',
          });
          return;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Usuário ou Senha incorretos',
          });
          throw err;
        }
      },
    });
  }
}
