import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/service/auth.service';
import { StorageService } from '../../core/services/service/storage.service';
import { AuthNotifyService } from '../../shared/auth-notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    aliasName: null,
    passWord: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private authNotify: AuthNotifyService
  ) {}

  ngOnInit(): void {
    if (this.storageService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  onSubmit(): void {
    const { aliasName, passWord } = this.form;
    console.log({ aliasName, passWord });
    this.authService.login(aliasName, passWord).subscribe({
      next: (data) => {
        this.storageService.saveToken(data.accessToken);
        this.storageService.saveRefreshToken(data.refreshToken);
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;

        this.reloadPage();
      },
      error: (err) => {
        console.log(err.error.message);

        this.authNotify.VerifyErroCode(err.error.message);

        this.isLoginFailed = true;
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
