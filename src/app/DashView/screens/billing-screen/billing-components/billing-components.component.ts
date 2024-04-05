import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-billing-components',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './billing-components.component.html',
  styleUrl: './billing-components.component.css',
})
export class BillingComponentsComponent {
  DataList = [
    {
      title: 'Receita',
      link: 'recipe',
      icon: 'billing.svg',
    },
  ];
}
