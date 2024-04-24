import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboards-view',
  standalone: true,
  imports: [],
  templateUrl: './dashboards-view.component.html',
  styleUrl: './dashboards-view.component.css',
})
export class DashboardsViewComponent {
  constructor(private router: Router) {}
  backScreen() {
    this.router.navigate(['/admin']);
  }
}
