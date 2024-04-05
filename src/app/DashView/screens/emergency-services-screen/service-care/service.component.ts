import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule, MatCardModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartTop_One!: Highcharts.Options;
  chartBottom_One!: Highcharts.Options;
  chartBottom_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartTop_One = {
      title: {
        text: 'Atendimento por mês',
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
        title: {
          text: '',
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Ordens',
          colors: [
            '#0040ff',
            '#0096ff',
            '#00abff',
            '#00c1ff',
            '#00ffec',
            '#00ffd6',
            '#00ffc1',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['11/23', 727],
            ['12/23', 875],
            ['01/24', 849],
            ['02/24', 941],
            ['03/24', 532],
          ],
        },
      ],
    };

    this.chartBottom_One = {
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          },
        },
      },

      title: {
        text: 'Atendimentos por convênio',
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
        title: {
          text: '',
        },
      },

      legend: { enabled: false },

      series: [
        {
          colors: [
            '#a52a2a',
            '#0040ff',
            '#0096ff',
            '#00abff',
            '#00c1ff',
            '#00ffec',
            '#00ffd6',
            '#00ffc1',
            '#00ffab',
          ],
          type: 'bar',
          colorByPoint: true,
          groupPadding: 0,
          name: 'Atendimento',
          data: [
            {
              name: 'Unimed',
              y: 1629,
            },
            {
              name: 'Ipasgo',
              y: 1592,
            },
            {
              name: 'Particular',
              y: 155,
            },
            {
              name: 'Bradesco',
              y: 150,
            },
            {
              name: 'Cassi',
              y: 103,
            },
            {
              name: 'Geap',
              y: 72,
            },
            {
              name: 'Vivacom',
              y: 68,
            },
            {
              name: 'Saúde Caixa',
              y: 56,
            },
            {
              name: 'Affego Saúde',
              y: 50,
            },
            {
              name: 'Fundaçáo Itaú',
              y: 46,
            },
            {
              name: 'Postal Saúde',
              y: 41,
            },
            {
              name: 'Sul América Seguro Saúde',
              y: 38,
            },
            {
              name: 'Bradesco Saúde',
              y: 15,
            },
            {
              name: 'Capsaúde',
              y: 9,
            },
            {
              name: 'CAESAN',
              y: 8,
            },
            {
              name: 'Assefaz',
              y: 3,
            },
            {
              name: 'Cortesia',
              y: 2,
            },
          ],
        },
      ],
    };

    this.chartBottom_Two = {
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          },
        },
      },

      title: {
        text: 'Atendimentos por médico',
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
        title: {
          text: '',
        },
      },

      legend: { enabled: false },

      series: [
        {
          colors: [
            '#a52a2a',
            '#0040ff',
            '#0096ff',
            '#00abff',
            '#00c1ff',
            '#00ffec',
            '#00ffd6',
            '#00ffc1',
            '#00ffab',
          ],
          type: 'bar',
          colorByPoint: true,
          groupPadding: 0,
          name: 'Atendimento',
          data: [
            {
              name: 'Médico A',
              y: 1629,
            },
            {
              name: 'Médico B',
              y: 1592,
            },
            {
              name: 'Médico C',
              y: 155,
            },
            {
              name: 'Médico D',
              y: 150,
            },
            {
              name: 'Médico E',
              y: 103,
            },
            {
              name: 'Médico F',
              y: 72,
            },
            {
              name: 'Médico G',
              y: 68,
            },
            {
              name: 'Médico H',
              y: 56,
            },
            {
              name: 'Médico I',
              y: 50,
            },
            {
              name: 'Médico J',
              y: 46,
            },
            {
              name: 'Médico K',
              y: 41,
            },
            {
              name: 'Médico L',
              y: 38,
            },
            {
              name: 'Médico M',
              y: 15,
            },
            {
              name: 'Médico N',
              y: 9,
            },
            {
              name: 'Outros',
              y: 8,
            },
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
