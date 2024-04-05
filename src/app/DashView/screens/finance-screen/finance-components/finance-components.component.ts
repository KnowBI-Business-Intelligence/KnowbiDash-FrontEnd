import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-finance-components',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './finance-components.component.html',
  styleUrl: './finance-components.component.css',
})
export class FinanceComponentsComponent {
  DataList = [
    {
      title: 'Contas a Receber',
      link: 'accounts_receivable',
      icon: 'finance.svg',
    },
    // {
    //   title: 'Fluxo de Caixa',
    //   link: 'cash_flow',
    //   icon: 'finance.svg',
    // },
    {
      title: 'Receita',
      link: 'treasury', // criar próprio componente caso necessário
      icon: 'finance.svg',
    },
  ];
}
