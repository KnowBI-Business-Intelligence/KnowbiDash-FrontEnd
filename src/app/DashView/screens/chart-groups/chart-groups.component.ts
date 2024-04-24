import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartsService } from '../../../core/services/charts/charts.service';
import { StorageService } from '../../../core/services/user/storage.service';

interface Group {
  id: string; // Adjust the type of id if necessary (could be number or string based on your actual data)
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
  groups: Group[] = [];
  chartgroups: { [key: string]: any[] } = {};
  selectedChartPath: any;

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
    localStorage.setItem('chartGroup', JSON.stringify(groupName));
    this.router.navigate(['/content/main/charts']);
  }

  backScreen() {
    this.router.navigate(['/content/main']);
  }
}
