import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbsComponent } from '../../DashView/components/breadcrumbs/breadcrumbs.component';
import { AuthService } from '../../services/service/auth/auth.service';
import { StorageService } from '../../services/service/user/storage.service';
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
  ],
  providers: [MessageService],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css',
})
export class LoginScreenComponent implements OnInit {
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
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveToken(data.token);
        this.storageService.saveRefreshToken(data.refreshToken);
        this.storageService.saveUser(data);
        this.roles = this.storageService.getUser().roles;

        if (this.roles.includes('ROLE_ADMIN')) {
          this.routes.navigate(['admin']);
        } else {
          this.routes.navigate(['content']);
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro na autenticação. ',
        });
        throw err;
      },
    });
  }
}
