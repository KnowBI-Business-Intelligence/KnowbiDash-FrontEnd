import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quality-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quality-component.component.html',
  styleUrl: './quality-component.component.css',
})
export class QualityComponentComponent {
  DataList = [
    {
      title: 'Atendimentos',
      link: 'service_quality',
      icon: 'clinical_center.svg',
    },
    {
      title: 'Notificações',
      link: 'notification',
      icon: 'clinical_center.svg',
    },
  ];
}
