import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartsService } from '../../../services/service/charts/charts.service';
import { StorageService } from '../../../services/service/user/storage.service';
import { HttpHeaders } from '@angular/common/http';

interface Group {
  id: string;
  name: string;
}

@Component({
  selector: 'app-chart-groups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-groups.component.html',
  styleUrl: './chart-groups.component.css',
})
export class ChartGroupsComponent implements OnInit {
  selectedChartPath: any;
  groups: Group[] = [];
  chartgroups: { [key: string]: any[] } = {};

  constructor(
    private router: Router,
    private chartService: ChartsService,
    private storageService: StorageService
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
      localStorage.getItem('selectedChartPath') || 'null'
    );

    data.forEach((dataItem: any) => {
      const group: any[] = [];
      if (dataItem.chartPath.id == this.selectedChartPath) {
        group.push(dataItem);

        this.chartgroups[dataItem.name] = group;
        this.groups.push(dataItem);
      }
    });
  }

  callCharts(groupName: any) {
    console.log(groupName);
    localStorage.setItem('chartGroup', JSON.stringify(groupName));
    this.router.navigate(['/content/main/charts']);
  }

  backScreen() {
    this.router.navigate(['/content/main']);
  }
}
