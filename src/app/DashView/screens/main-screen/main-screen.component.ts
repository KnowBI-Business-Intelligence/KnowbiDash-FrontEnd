import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LocalstorageService } from '../../../core/services/local-storage/local-storage.service';
import { StorageService } from '../../../core/services/user/storage.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProfilesService } from '../../../core/services/profiles/profiles.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class MainScreenComponent implements OnInit {
  icons = {
    search: faMagnifyingGlass,
  };
  searchTerm: string = '';
  profiles: any[] = [];
  profilesData: any[] = [];
  filteredItems: any;
  pathsByProfile: { [key: string]: any[] } = {};
  private user = this.storageService.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private localStorage: LocalstorageService,
    private profilesService: ProfilesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserById(this.user.id, this.user.token);
  }

  getUserById(id: number, token: any) {
    this.authService.getById(id, this.headers).subscribe({
      next: (data: any) => {
        this.getProfilesData(data.id);
      },
    });
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
        this.processData(this.profilesData);
      },
    });
  }

  processData(data: any) {
    data.forEach((profile: any) => {
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
      'selectedChartPathUser',
      JSON.stringify(pathObj)
    );
    this.router.navigate(['content/main/chartgroup']);
  }
}
