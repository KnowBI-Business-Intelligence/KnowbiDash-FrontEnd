import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pharmacy-compoment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pharmacy-compoment.component.html',
  styleUrl: './pharmacy-compoment.component.css',
})
export class PharmacyCompomentComponent {
  DataList = [
    {
      title: 'Tempo de Produção',
      link: 'production_time',
      icon: 'medical.svg',
    },
    {
      title: 'Perda de Estoque',
      link: 'loss_stock',
      icon: 'medical.svg',
    },
    {
      title: 'Produtividade Geral',
      link: 'general_productivity',
      icon: 'medical.svg',
    },
    {
      title: 'Inventário',
      link: 'inventory',
      icon: 'medical.svg',
    },
    {
      title: 'Medicamento Não Padronizado',
      link: 'non_standart',
      icon: 'medical.svg',
    },
    {
      title: 'Produtividade por Colaborador',
      link: 'employee_productivity',
      icon: 'medical.svg',
    },

    {
      title: 'Material Prescrito x Utilizados',
      link: 'mat_prescribed_x_used',
      icon: 'medical.svg',
    },
  ];
}
