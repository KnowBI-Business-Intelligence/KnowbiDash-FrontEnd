import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../core/services/user/storage.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LocalstorageService } from '../../../core/services/local-storage/local-storage.service';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';
import { WebsocketDBService } from '../../../core/services/websocket/websocket-db-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adm-main-screen',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './adm-main-screen.component.html',
  styleUrl: './adm-main-screen.component.css',
})
export class ADMMainScreenComponent implements OnInit {
  icons = {
    search: faMagnifyingGlass,
  };
  isLoading: boolean = true;
  searchTerm: string = '';
  profiles: any[] = [];
  profilesData: any[] = [];
  filteredItems: any;
  pathsByProfile: { [key: string]: any[] } = {};
  private user = this.storageService.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  streamDataSubscription!: Subscription;
  streamMessage: any;

  constructor(
    private profilesService: ProfilesService,
    private authService: AuthService,
    private storageService: StorageService,
    private localStorage: LocalstorageService,
    private websocketService: WebsocketDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserById(this.user.id, this.user.token);
    /*this.websocketService.streamData();
    this.streamDataSubscription = this.websocketService.dataModel.subscribe(
      (data) => {
        this.streamMessage = data;
        console.log('Nova mensagem WebSocket recebida:', this.streamMessage);
      }
    );*/
  }

  getUserById(id: number, token: any) {
    this.authService.getById(id, this.headers).subscribe({
      next: (data: any) => {
        this.interruptLoadingScreen();
        this.getProfilesData(data.id);
      },
      error: () => {
        this.interruptLoadingScreen();
      },
    });
  }

  getProfilesData(data: string) {
    this.profilesService.getProfiles(this.headers).subscribe({
      next: (value: any) => {
        console.log(value);
        value.map((profileData: any) => {
          profileData.users.map((userData: any) => {
            if (userData.id == data) {
              this.profilesData.push(profileData);
            }
          });
        });
        this.processData(this.profilesData);
      },
    });
  }

  processData(data: any) {
    data.forEach((profile: any) => {
      console.log(profile);
      const paths: string[] = [];
      if (profile && profile.chartPaths) {
        profile.chartPaths.forEach((chartPath: any) => {
          paths.push(chartPath);
        });
      }
      this.pathsByProfile[profile.name] = paths;
      this.profiles.push({ name: profile.name, paths: paths });
      this.filteredItems = this.profiles;
    });
  }

  onInputChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (searchTerm === '') {
      this.filteredItems = this.profiles;
      return;
    }

    this.filteredItems = this.profiles
      .map((profile: any) => {
        const filteredPaths = profile.paths.filter((path: any) =>
          path.name.toLowerCase().includes(searchTerm)
        );
        if (filteredPaths.length > 0) {
          return {
            ...profile,
            paths: filteredPaths,
          };
        }
        return null;
      })
      .filter((profile: any) => profile !== null);
  }

  openChartGroup(pathObj: any) {
    this.localStorage.setEncryptedItem(
      'selectedChartPath',
      JSON.stringify(pathObj)
    );
    this.router.navigate(['admin/adm_main_dashboard']);
  }

  interruptLoadingScreen() {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
