import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hospitality-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './emergency-services-component.component.html',
  styleUrl: './emergency-services-component.component.css',
})
export class EmergencyServicesComponentComponent {
  DataList = [
    {
      title: 'Tempos',
      link: 'time',
      icon: 'emergency.svg',
    },
    {
      title: 'Materiais e Medicamentos',
      link: 'mat_med',
      icon: 'emergency.svg',
    },
    {
      title: 'Atendimentos',
      link: 'service',
      icon: 'emergency.svg',
    },
  ];
}
