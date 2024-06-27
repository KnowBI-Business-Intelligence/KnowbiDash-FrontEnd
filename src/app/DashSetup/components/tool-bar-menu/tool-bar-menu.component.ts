import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { AuthService } from '../../../core/services/auth/auth.service';
import { BreadrumbsService } from '../../../core/services/breadcrumb/breadrumbs.service';
import { StorageService } from '../../../core/services/user/storage.service';
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';
import { CustomerService } from '../../screens/users-screen/users/data/costumer-data';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';
import { HttpHeaders } from '@angular/common/http';

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
  icon: HTMLElement | null = null;
  item: HTMLElement | null = null;
  collapsed = false;
  screenWidth = 0;
  private roles: string[] = [];
  profilesData: any[] = [];

  isLoggedIn: boolean = false;
  showInitials: boolean = true;
  modalView: boolean = false;
  showModal: boolean = false;

  aliasName?: string;
  user: any;
  userFirstName: any;

  menuAtivo: any;

  private userReq = this.token.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.userReq.token}`,
  });

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
    private router: Router,
    private elementRef: ElementRef,
    private profilesService: ProfilesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();
    this.successMessageToast('teste');

    this.initials();
    if (this.menuAtivo == '') {
      this.menuAtivo = 'home';
    } else {
      this.icon = this.elementRef.nativeElement.querySelector('.icon');
      this.item = this.elementRef.nativeElement.querySelector('.menu-item');
      this.icon!.style.color = '#7B5FA5';
      this.item!.style.color = '#7B5FA5';
    }

    this.getProfilesData(this.user.id);
  }

  getProfilesData(data: string) {
    this.profilesService.getProfiles(this.headers).subscribe({
      next: (value: any) => {
        value.map((profileData: any) => {
          profileData.users.map((userData: any) => {
            if (userData.id == data) {
              this.profilesData.push(profileData);
            }
          });
        });
      },
    });
  }

  initials() {
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

  onProfileClick() {
    this.router.navigate(['/admin/users_panel/edit_users'], {
      state: { item: this.user },
    });
  }

  toggleMenuAtivo(item: string) {
    this.menuAtivo = item;
    this.toggleClose();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.token.signOut();
        this.router.navigate(['/login']);
      },
      error: (e) => {},
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

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  switchApplication() {
    this.router.navigate(['content']);
  }

  errorMessageToast(message: string) {
    return this.messageService.add({
      severity: 'error',
      detail: message,
    });
  }

  warnMessageToast(message: string) {
    return this.messageService.add({
      severity: 'warn',
      detail: message,
    });
  }

  successMessageToast(message: string) {
    return this.messageService.add({
      severity: 'success',
      detail: message,
      life: 80000,
    });
  }
}
