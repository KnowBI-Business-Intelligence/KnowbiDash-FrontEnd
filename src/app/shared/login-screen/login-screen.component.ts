import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

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
    FontAwesomeModule,
  ],
  providers: [MessageService],
  templateUrl: './login-screen.component.html',
  styleUrls: [
    './login-screen.component.css',
    '../../core/globalStyle/toast.css',
  ],
})
export class LoginScreenComponent implements OnInit, AfterViewInit {
  mainContent: HTMLElement | null = null;
  isADM!: boolean;
  isModal: boolean = true;
  visible: boolean = false;
  isLoginLoading: boolean = false;

  form: any = {
    username: null,
    password: null,
  };

  icons = {
    eye: faEye,
    eyeSlash: faEyeSlash,
  };

  roles: string[] = [];
  currentIcon: IconDefinition = this.icons.eye;
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private routes: Router,
    private messageService: MessageService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (this.storageService.getToken()) {
      this.roles = this.storageService.getUser().roles;
    }
  }

  ngAfterViewInit(): void {
    this.loadingScreen();
  }

  loadingScreen() {
    this.mainContent =
      this.elementRef.nativeElement.querySelector('.container');
    this.mainContent?.style.display;
    setTimeout(() => {
      this.mainContent!.style.display = 'flex';
    }, 2000);
  }

  showDialog() {
    this.visible = true;
  }

  toggleIcon() {
    this.currentIcon =
      this.currentIcon === this.icons.eye
        ? this.icons.eyeSlash
        : this.icons.eye;
  }

  /*defaultOrAdm(isAdmin: boolean): void {
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
  }*/

  onSubmit(): void {
    const { username, password } = this.form;
    this.isLoginLoading = true;
    try {
    } catch (error) {
      console.error('Erro ao fazer requisição de login:', error);
    }
    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveToken(data.token);
        this.storageService.saveRefreshToken(data.refreshToken);
        this.storageService.saveUser(data);
        this.roles = this.storageService.getUser().roles;
        if (this.roles.includes('ROLE_ADMIN')) {
          setTimeout(() => {
            this.isLoginLoading = false;
            ['admin'];
            this.routes.navigate(['admin']);
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
        }
      },
    });
  }
}
