import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chart-groups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-groups.component.html',
  styleUrl: './chart-groups.component.css',
})
export class ChartGroupsComponent implements OnInit {
  selectedChartPath: any;
  groups: string[] = [];
  chartgroups: { [key: string]: any[] } = {};

  constructor() {}

  ngOnInit(): void {
    /*this.selectedChartPath = JSON.parse(
      localStorage.getItem('selectedChartPath') || 'null'
    );
    console.log('armazenado', this.selectedChartPath);*/
    this.initData();
  }

  initData() {
    this.selectedChartPath = JSON.parse(
      localStorage.getItem('selectedChartPath') || 'null'
    );
    console.log(this.selectedChartPath);

    this.selectedChartPath.forEach((chartGroups: any) => {
      const group: any[] = []; // Criar um novo array para cada grupo

      group.push(chartGroups);

      this.chartgroups[chartGroups.name] = group;
      this.groups.push(chartGroups.name);
    });
  }

  callCharts(groupName: any) {
    console.log(groupName);
  }
}
