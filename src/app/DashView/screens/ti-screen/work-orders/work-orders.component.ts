import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './work-orders.component.html',
  styleUrl: './work-orders.component.css',
})
export class WorkOrdersComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chart_One!: Highcharts.Options;
  chart_Two!: Highcharts.Options;
  chart_Three!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chart_One = {
      title: {
        text: 'Encerradas por mês',
        align: 'center',
      },
      subtitle: { text: 'Total: 1.615 OS' },
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
      series: [
        {
          type: 'column',
          name: 'Ordens',
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
            ['08/2023', 292],
            ['09/2023', 258],
            ['10/2023', 329],
            ['11/2023', 228],
            ['12/2023', 238],
            ['01/2024', 133],
            ['02/2024', 137],
          ],
        },
      ],
    };

    this.chart_Two = {
      title: {
        text: 'Encerradas por dia da semana',
        align: 'center',
      },
      subtitle: { text: 'Total: 1.615 OS' },
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
      series: [
        {
          type: 'column',
          name: 'Ordens',
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
            ['Segunda-Feira', 347],
            ['Terça-Feira', 325],
            ['Quarta-Feira', 394],
            ['Quinta-Feira', 327],
            ['Sexta-Feira', 220],
            ['Sábado', 2],
            ['Doming', 0],
          ],
        },
      ],
    };

    this.chart_Three = {
      title: {
        text: 'Quantidade por mês pela classificação',
        align: 'center',
      },
      xAxis: {
        categories: [
          '08/2023',
          '09/2023',
          '10/2023',
          '11/2023',
          '12/2023',
          '01/2024',
          '02/2024',
          '03/2024',
        ],
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

      series: [
        {
          type: 'column',
          name: 'Defeito',
          colors: ['#0040ff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [24, 36, 41, 45, 38, 45, 18, 18],
        },
        {
          type: 'column',
          name: 'Dúvida',
          colors: ['#00c1ff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [17, 14, 40, 28, 46, 7, 10],
        },
        {
          type: 'column',
          name: 'Solicitação',
          colors: ['#00ffec'],
          colorByPoint: true,
          groupPadding: 0,
          data: [251, 207, 248, 160, 147, 108, 109],
        },
        {
          type: 'column',
          name: 'Sugestão',
          colors: ['#00ffab'],
          colorByPoint: true,
          groupPadding: 0,
          data: [null, 1, 2, null, 7, null],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
