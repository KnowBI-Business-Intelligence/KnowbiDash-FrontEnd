import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faChartSimple,
  faDatabase,
  faFolder,
  faHome,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CustomerService } from '../../../../assets/data/costumer-data';
import { BreadcrumbsComponent } from '../../../DashView/components/breadcrumbs/breadcrumbs.component';
import { AuthService } from '../../../services/service/auth/auth.service';
import { BreadrumbsService } from '../../../services/service/breadcrumb/breadrumbs.service';
import { StorageService } from '../../../services/service/user/storage.service';

@Component({
  selector: 'app-tool-bar-menu',
  standalone: true,
  imports: [
    MatToolbarModule,
    FontAwesomeModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
    RouterModule,
    ToastModule,
    MatSidenavModule,
    MatListModule,
    BreadcrumbsComponent,
  ],
  providers: [MessageService, BreadrumbsService, CustomerService],
  templateUrl: './tool-bar-menu.component.html',
  styleUrl: './tool-bar-menu.component.css',
})
export class ToolBarMenuComponent implements OnInit {
  private roles: string[] = [];

  isLoggedIn: boolean = false;
  showInitials: boolean = true;
  modalView: boolean = false;

  aliasName?: string;
  user: any;
  userFirstName: any;

  icons = {
    home: faHome,
    chart: faChartSimple,
    logout: faArrowRightFromBracket,
    database: faDatabase,
    user: faUser,
    profiles: faFolder,
  };

  constructor(
    private auth: AuthService,
    private token: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();

    if (this.isLoggedIn) {
      this.user = this.token.getUser();

      this.roles = this.user.roles;

      this.aliasName = this.user.aliasName;
    }

    if (this.user) {
      const name = this.user.fullUserName.split(' ');
      this.userFirstName = name[0];
    }
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.token.signOut();
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.error('erro logout', e);
      },
    });
  }
}
