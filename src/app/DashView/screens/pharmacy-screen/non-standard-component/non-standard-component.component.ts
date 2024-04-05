import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-non-standard-component',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './non-standard-component.component.html',
  styleUrl: './non-standard-component.component.css',
})
export class NonStandardComponentComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartTop_One!: Highcharts.Options;
  chartTop_Two!: Highcharts.Options;
  chartBottom_One!: Highcharts.Options;
  chartBottom_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartTop_One = {
      title: {
        text: 'Total e média anual',
        align: 'center',
      },

      xAxis: {
        type: 'category',
        categories: ['2023', '2024'],
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },

      yAxis: {
        min: 0,
        title: {
          text: '',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' NP',
      },

      series: [
        {
          type: 'column',
          name: 'Total',
          colors: ['#0040ff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [5378, 3368],
        },
        {
          type: 'column',
          name: 'Médias',
          colors: ['#00ecff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [448.17, 280.67],
        },
      ],
    };

    this.chartTop_Two = {
      title: {
        text: 'Prescritos por mês',
        align: 'center',
      },
      subtitle: { text: 'Total: 1.535' },
      xAxis: {
        type: 'category',
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Prescritos',
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'column',
          name: 'Prescrito',
          colors: [
            '#0040ff',
            '#0055ff',
            '#006bff',
            '#0080ff',
            '#0096ff',
            '#00abff',
            '#00c1ff',
            '#00d6ff',
            '#00ecff',
            '#00ffff',
            '#00ffec',
            '#00ffd6',
            '#00ffc1',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['08/2023', 165],
            ['09/2023', 120],
            ['10/2023', 322],
            ['11/2023', 220],
            ['12/2023', 265],
            ['01/2024', 319],
            ['02/2024', 289],
          ],
        },
      ],
    };

    this.chartBottom_One = {
      title: {
        text: 'Top 15: Medicamentos Prescritos',
        align: 'center',
      },

      xAxis: {
        type: 'category',
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },
      yAxis: {
        min: 0,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' min',
      },

      series: [
        {
          type: 'bar',
          name: 'Prescritos',
          colors: [
            '#0040ff',
            '#0055ff',
            '#006bff',
            '#0080ff',
            '#0096ff',
            '#00abff',
            '#00c1ff',
            '#00d6ff',
            '#00ecff',
            '#00ffff',
            '#00ffec',
            '#00ffd6',
            '#00ffc1',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Dipirona', 104],
            ['Omeprazol', 29],
            ['Amoxicilina', 43],
            ['Dexametasona', 120],
            ['Dorflex', 75],
            ['Rivotril', 97],
            ['Sertralina', 51],
            ['Atenolol', 30],
            ['Clonazepam', 114],
            ['Fluoxetina', 89],
            ['Hidroclorotiazida', 48],
            ['Losartana', 123],
            ['Metformina', 102],
            ['Sinvastatina', 67],
            ['Tramadol', 81],
          ],
        },
      ],
    };

    this.chartBottom_Two = {
      title: {
        text: 'Top 15: Prescrição por médico',
        align: 'center',
      },

      xAxis: {
        type: 'category',
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },
      yAxis: {
        min: 0,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' min',
      },

      series: [
        {
          type: 'bar',
          name: 'Prescritos',
          colors: [
            '#0040ff',
            '#0055ff',
            '#006bff',
            '#0080ff',
            '#0096ff',
            '#00abff',
            '#00c1ff',
            '#00d6ff',
            '#00ecff',
            '#00ffff',
            '#00ffec',
            '#00ffd6',
            '#00ffc1',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Médico A', 85],
            ['Médico B', 62],
            ['Médico C', 104],
            ['Médico D', 29],
            ['Médico E', 43],
            ['Médico F', 120],
            ['Médico G', 75],
            ['Médico H', 97],
            ['Médico I', 51],
            ['Médico J', 30],
            ['Médico K', 114],
            ['Médico L', 89],
            ['Médico M', 48],
            ['Médico N', 123],
            ['Médico O', 102],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
