import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadrumbsService } from '../../../core/services/breadcrumb/breadrumbs.service';
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-adm-main-screen',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  providers: [BreadrumbsService],
  templateUrl: './adm-main-screen.component.html',
  styleUrl: './adm-main-screen.component.css',
})
export class ADMMainScreenComponent {}
