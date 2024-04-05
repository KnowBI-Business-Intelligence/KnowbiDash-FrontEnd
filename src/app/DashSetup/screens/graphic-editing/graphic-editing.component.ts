import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Highcharts from 'highcharts';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-graphic-editing',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    RouterModule,
    MatSidenavModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './graphic-editing.component.html',
  styleUrl: './graphic-editing.component.css',
})
export class GraphicEditingComponent {
  isAppearance: boolean = false;
  isConfiguration: boolean = false;
  panelOpenState: boolean = true;

  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

  icons = {
    plus: faPlus,
    minus: faMinus,
  };

  form = {
    title: null,
  };

  selectedValue!: string;

  colors: Food[] = [
    { value: 'transparent', viewValue: 'Transparente' },
    { value: 'color', viewValue: 'Cor' },
  ];

  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart'; // string optional, padrão 'chart'
  chartOptions: Highcharts.Options = {
    series: [
      {
        data: [1, 2, 3],
        type: 'line',
      },
    ],
  };
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {}; // function opicional, padrão null
  updateFlag: boolean = false; //  boolean opicional
  oneToOneFlag: boolean = true; // booleanopicional, padrão false
  runOutsideAngular: boolean = false; // booleanopicional, padrão false

  constructor() {}

  toggleConfiguration() {
    this.isConfiguration = true;
    this.isAppearance = false;
  }

  toggleAppearance() {
    this.isAppearance = true;
    this.isConfiguration = false;
  }
}
