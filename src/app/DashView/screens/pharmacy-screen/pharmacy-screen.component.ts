import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pharmacy-screen',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './pharmacy-screen.component.html',
  styleUrl: './pharmacy-screen.component.css',
})
export class PharmacyScreenComponent {}
