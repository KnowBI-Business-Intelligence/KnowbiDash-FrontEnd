import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAtom,
  faBars,
  faCaretDown,
  faChartPie,
  faGears,
  faHouse,
  faRightFromBracket,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../services/service/auth/auth.service';
import { BreadrumbsService } from '../../../services/service/breadcrumb/breadrumbs.service';
import { EventSearchService } from '../../../services/service/event/event-search.service';
import { StorageService } from '../../../services/service/user/storage.service';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    RouterModule,
    RippleModule,
    CommonModule,
    RouterOutlet,
    FontAwesomeModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    BreadcrumbsComponent,
  ],
  providers: [BreadrumbsService],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  private roles: string[] = [];

  isLoggedIn: boolean = false;
  isExpanded: boolean = false;

  showPanelUser: boolean = false;
  showPanelAdmin: boolean = false;
  showPanelModerator: boolean = false;

  aliasName?: string;
  user: any;
  userFirstName: any;

  icons = {
    logout: faRightFromBracket,
    buttonNavCollapsed: faBars,
    buttonNavExpanded: faXmark,
    settings: faGears,
    user: faUser,
    dash: faChartPie,
    home: faHouse,
    assistant: faAtom,
    profile: faCaretDown,
  };

  showInitials: boolean = true;

  constructor(
    private tokenService: StorageService,
    private eventSearch: EventSearchService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenService.getToken();

    if (this.isLoggedIn) {
      this.user = this.tokenService.getUser();

      this.roles = this.user.roles;

      this.showPanelAdmin = this.roles.includes('ROLE_ADMIN');
      this.showPanelModerator = this.roles.includes('ROLE_MODERATOR');
      this.showPanelUser = this.roles.includes('ROLE_USER');

      this.aliasName = this.user.aliasName;
    }

    if (this.user) {
      const name = this.user.fullUserName.split(' ');
      this.userFirstName = name[0];
    }

    this.eventSearch.on('logout', () => {
      this.logout();
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.tokenService.signOut();
        this.router.navigate(['/login']);
      },
      error: (e) => {
        console.error('erro logout', e);
      },
    });
  }

  toggleExpandedCollapsed() {
    this.isExpanded = !this.isExpanded;
  }

  toggleCollapsed() {
    this.isExpanded = false;
  }
}
