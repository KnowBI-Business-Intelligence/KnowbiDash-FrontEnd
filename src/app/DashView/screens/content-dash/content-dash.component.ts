import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-content-dash',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './content-dash.component.html',
  styleUrl: './content-dash.component.css',
})
export class ContentDashComponent {
  moduleDataList = [
    {
      title: 'Centro Clínico',
      link: 'emergency_services',
      icon: 'clinical_center.svg',
    },
    {
      title: 'Pronto Atendimento',
      link: 'emergency_services',
      icon: 'emergency.svg',
    },
    {
      title: 'Farmácia',
      link: 'pharmacy',
      icon: 'medical.svg',
    },
    {
      title: 'Suprimentos',
      link: 'supplies',
      icon: 'supplies.svg',
    },
    {
      title: 'Faturamento',
      link: 'billing',
      icon: 'billing.svg',
    },
    {
      title: 'Financeiro',
      link: 'finance',
      icon: 'finance.svg',
    },
    {
      title: 'Qualidade',
      link: 'quality',
      icon: 'quality.svg',
    },

    {
      title: 'Tecnologia da Informação',
      link: 'ti',
      icon: 'ti.svg',
    },
    {
      title: 'Hotelaria',
      link: 'ti',
      icon: 'hospitality.svg',
    },
  ];
}
