import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartsService } from '../../../core/services/charts/charts.service';
import { LocalstorageService } from '../../../core/services/local-storage/local-storage.service';
import { StorageService } from '../../../core/services/user/storage.service';
import {
  faArrowLeft,
  faChartPie,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
interface Group {
  id: string;
  name: string;
}

@Component({
  selector: 'app-chart-groups',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './chart-groups.component.html',
  styleUrl: './chart-groups.component.css',
})
export class ChartGroupsComponent implements OnInit {
  icons = {
    dash: faChartPie,
    search: faMagnifyingGlass,
    backDash: faArrowLeft,
  };
  searchTerm: string = '';
  pathName: string = '';
  listpages: any;
  filteredItems: any;
  groups: Group[] = [];
  chartgroups: { [key: string]: any[] } = {};
  selectedChartPath: any;

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private chartService: ChartsService,
    private storageService: StorageService,
    private localStorage: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.getChartGroups();
    this.isLoading = true;
  }

  getChartGroups(): void {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.chartService.getChartGroup(headers).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        this.initData(data);
      },
    });
  }

  initData(data: any) {
    this.selectedChartPath = JSON.parse(
      this.localStorage.getDecryptedItem('selectedChartPathUser')
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

    this.filteredItems = this.groups.filter((group: Group) =>
      group.name.toLowerCase().includes(searchTerm)
    );
  }

  callCharts(groupName: any) {
    this.localStorage.setEncryptedItem(
      'chartGroupUser',
      JSON.stringify(groupName)
    );
    this.router.navigate(['/content/main/charts']);
  }

  backScreen() {
    this.router.navigate(['/content/main']);
  }
}
