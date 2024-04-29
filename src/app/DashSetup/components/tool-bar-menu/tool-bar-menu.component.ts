import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faAtom,
  faChartSimple,
  faDatabase,
  faDiagramProject,
  faHome,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CustomerService } from '../../../../assets/data/costumer-data';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BreadrumbsService } from '../../../core/services/breadcrumb/breadrumbs.service';
import { StorageService } from '../../../core/services/user/storage.service';
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';

interface SideNavTogle {
  screenWidth: number;
  collapsed: boolean;
}

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
    MatIconModule,
  ],
  providers: [MessageService, BreadrumbsService, CustomerService],
  templateUrl: './tool-bar-menu.component.html',
  styleUrl: './tool-bar-menu.component.css',
})
export class ToolBarMenuComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavTogle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
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
    profiles: faDiagramProject,
    assistant: faAtom,
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
      this.userFirstName = name[0].charAt(0).toUpperCase();
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

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  toggleClose() {
    this.collapsed = false;
  }
}
