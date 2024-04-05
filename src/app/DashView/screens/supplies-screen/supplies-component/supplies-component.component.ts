import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-supplies-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplies-component.component.html',
  styleUrl: './supplies-component.component.css',
})
export class SuppliesComponentComponent {
  DataList = [
    {
      title: 'Consumo - Análise Geral',
      link: 'consumption',
      icon: 'supplies.svg',
    },
  ];
}
