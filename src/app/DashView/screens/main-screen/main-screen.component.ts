import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/service/user/storage.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private token: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.initUserData();
  }

  initUserData() {
    this.user = this.token.getUser();

    this.user.profiles.forEach((profile: any) => {
      const paths: string[] = [];
      if (profile && profile.chartPaths) {
        profile.chartPaths.forEach((chartPath: any) => {
          console.log('Chart Path:', chartPath);
          paths.push(chartPath);
        });
      }
      this.pathsByProfile[profile.name] = paths;
      this.perfis.push(profile.name);
    });
  }

  openChartGroup(pathObj: any) {
    localStorage.setItem('selectedChartPath', JSON.stringify(pathObj));
    this.router.navigate(['/content/main/chartgroup']);
  }
}
