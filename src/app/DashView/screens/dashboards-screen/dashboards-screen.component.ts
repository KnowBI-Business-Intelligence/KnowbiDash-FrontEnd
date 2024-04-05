import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';

@Component({
  selector: 'app-dashboards-screen',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './dashboards-screen.component.html',
  styleUrl: './dashboards-screen.component.css',
})
export class DashboardsScreenComponent {}
