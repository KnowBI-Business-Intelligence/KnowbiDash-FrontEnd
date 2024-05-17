import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartPie,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

interface Group {
  id: string;
  name: string;
}

@Component({
  selector: 'app-adm-main-dashboards',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './adm-main-dashboards.component.html',
  styleUrl: './adm-main-dashboards.component.css',
})
export class AdmMainDashboardsComponent implements OnInit {
  icons = {
    dash: faChartPie,
    search: faMagnifyingGlass,
  };
  searchTerm: string = '';
  pathName: string = '';
  listpages: any;
  filteredItems: any;
  groups: Group[] = [];
  chartgroups: { [key: string]: any[] } = {};
  selectedChartPath: any;

  constructor(
    private router: Router,
    private chartService: ChartsService,
    private storageService: StorageService,
    private localStorage: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.getChartGroups();
  }

  getChartGroups(): void {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.chartService.getChartGroup(headers).subscribe({
      next: (data) => {
        this.initData(data);
      },
    });
  }

  initData(data: any) {
    this.selectedChartPath = JSON.parse(
      this.localStorage.getDecryptedItem('selectedChartPath') || 'null'
    );
    this.pathName = this.selectedChartPath.name;
    data.forEach((dataItem: any) => {
      dataItem.chartPath.forEach((path: any) => {
        const group: any[] = [];
        if (path.id == this.selectedChartPath.id) {
          group.push(dataItem);
          this.chartgroups[dataItem.name] = group;
          this.groups.push(dataItem);
          this.filteredItems = this.groups;
        }
      });
    });
  }

  onInputChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (searchTerm == '') {
      this.filteredItems = this.groups;
      return;
    }

    console.log(this.filteredItems);

    this.filteredItems = this.groups.filter((group: Group) =>
      group.name.toLowerCase().includes(searchTerm)
    );
  }

  callCharts(groupName: any) {
    this.localStorage.setEncryptedItem('chartGroup', JSON.stringify(groupName));
    this.router.navigate(['/admin/adm_main_charts']);
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }
}
