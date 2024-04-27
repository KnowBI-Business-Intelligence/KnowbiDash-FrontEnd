import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  group: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.group = JSON.parse(localStorage.getItem('chartGroupview') || 'null');
    this.loadDataView(this.group.id);
  }

  loadDataView(id: string) {
    console.log(id);
  }

  backScreen() {
    this.router.navigate(['/admin/dashboards']);
  }
}
