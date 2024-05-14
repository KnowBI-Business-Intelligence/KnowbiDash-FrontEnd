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
import { ChartsService } from '../../../core/services/charts/charts.service';

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
  pathsByProfile: { [key: string]: any[] } = {};
  private user = this.storageService.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private localStorage: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserById(this.user.id, this.user.token);
  }

  getUserById(id: number, token: any) {
    this.authService.getById(id, this.headers).subscribe({
      next: (data: any) => {
        this.processData(data);
      },
    });
    console.log(this.user);
  }

  processData(data: any) {
    data.perfis.forEach((profile: any) => {
      const paths: string[] = [];
      if (profile && profile.chartPaths) {
        profile.chartPaths.forEach((chartPath: any) => {
          paths.push(chartPath);
        });
      }
      this.pathsByProfile[profile.name] = paths;
      this.profiles.push({ name: profile.name, paths: paths });
      console.log(this.pathsByProfile);
    });
  }

  applyFilter(term: string) {
    return (profile: any) => {
      const lowercaseTerm = term.toLowerCase();
      return (
        profile.name.toLowerCase().includes(lowercaseTerm) ||
        profile.paths.some((path: any) =>
          path.name.toLowerCase().includes(lowercaseTerm)
        )
      );
    };
  }

  openChartGroup(pathObj: any) {
    this.localStorage.setEncryptedItem(
      'selectedChartPathUser',
      JSON.stringify(pathObj.id)
    );
    this.router.navigate(['content/main/chartgroup']);
  }
}
