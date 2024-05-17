import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ChartsService } from '../../../core/services/charts/charts.service';
import { StorageService } from '../../../core/services/user/storage.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LocalstorageService } from '../../../core/services/local-storage/local-storage.service';

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

  searchTerm: string = '';
  profiles: any[] = [];
  pathsByProfile: { [key: string]: any[] } = {};
  private user = this.storageService.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  constructor(
    private charts: ChartsService,
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
    });
  }

  openChartGroup(pathObj: any) {
    this.localStorage.setEncryptedItem(
      'selectedChartPath',
      JSON.stringify(pathObj)
    );
    this.router.navigate(['admin/adm_main_dashboard']);
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
}
