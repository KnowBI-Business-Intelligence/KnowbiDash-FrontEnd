import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../../DashView/components/breadcrumbs/breadcrumbs.component';
import { BreadrumbsService } from '../../../services/service/breadcrumb/breadrumbs.service';

@Component({
  selector: 'app-adm-main-screen',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  providers: [BreadrumbsService],
  templateUrl: './adm-main-screen.component.html',
  styleUrl: './adm-main-screen.component.css',
})
export class ADMMainScreenComponent {}
