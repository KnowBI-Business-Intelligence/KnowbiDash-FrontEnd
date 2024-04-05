import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ti-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ti-component.component.html',
  styleUrl: './ti-component.component.css',
})
export class TIComponent {
  DataList = [
    {
      title: 'Ordens de Serviço',
      link: 'work_orders',
      icon: 'ti.svg',
    },
    {
      title: 'Produtividade',
      link: 'productivity',
      icon: 'ti.svg',
    },
  ];
}
