import { Component, OnInit } from '@angular/core';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadrumbsService } from '../../core/services/breadcrumb/breadrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: any[] = [];

  constructor(private breadcrumbService: BreadrumbsService) {}

  ngOnInit() {
    this.breadcrumbService.breadcrumbsChanged.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }
}
