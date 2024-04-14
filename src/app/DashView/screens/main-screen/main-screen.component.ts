import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/service/user/storage.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/service/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class MainScreenComponent implements OnInit {
  user: any;
  perfis: string[] = [];
  pathsByProfile: { [key: string]: any[] } = {};

  constructor(
    private token: StorageService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.initUserData();
  }

  initUserData() {
    this.user = this.token.getUser();
    this.getUserById(this.user.id, this.user.token);
    console.log(this.user);
  }

  getUserById(id: number, token: any) {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.authService.getById(id, headers).subscribe({
      next: (data) => {
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
      this.perfis.push(profile.name);
    });
  }

  openChartGroup(pathObj: any) {
    console.log('pathOBJ ', pathObj);
    localStorage.setItem('selectedChartPath', JSON.stringify(pathObj.id));
    this.router.navigate(['/content/main/chartgroup']);
  }
}
