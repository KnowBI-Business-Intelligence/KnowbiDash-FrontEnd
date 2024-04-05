import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.css',
})
export class CashFlowComponent {
  loadingScreen: boolean;

  constructor() {
    this.loadingScreen = true;
  }
}
