import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-productivity',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './productivity.component.html',
  styleUrl: './productivity.component.css',
})
export class ProductivityComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartTop_One!: Highcharts.Options;
  chartTop_Two!: Highcharts.Options;
  chartTop_Three!: Highcharts.Options;
  chartBottom_One!: Highcharts.Options;
  chartBottom_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartTop_One = {
      title: {
        text: 'Encerradas por executante',
        align: 'center',
      },
      subtitle: { text: 'Total: 1.515 OS' },
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
            ['Antonio', 26],
            ['Bernardo', 131],
            ['Carlos', 501],
            ['Danial', 131],
            ['Estevão', 538],
            ['Fabricio', 97],
            ['Guilherme', 27],
            ['Hélio', 41],
            ['Italo', 23],
          ],
        },
      ],
    };

    this.chartTop_Two = {
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          },
        },
      },
      tooltip: { valueSuffix: ' horas' },
      title: {
        text: 'Hora por executante',
        align: 'center',
      },
      subtitle: { text: 'Total: 2.706' },
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
          name: 'Total',
          colors: [
            '#0055ff',
            '#0096ff',
            '#00abff',
            '#00d6ff',
            '#00ecff',
            '#00ffff',
            '#00ffd6',
            '#00ffc1',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Antonio', 53],
            ['Bernardo', 652],
            ['Carlos', 702],
            ['Danial', 256],
            ['Estevão', 512],
            ['Fabricio', 486],
            ['Guilherme', 65],
            ['Hélio', 67],
            ['Italo', 86],
          ],
        },
      ],
    };

    this.chartTop_Three = {
      title: {
        text: 'Ordens de Serviços',
      },

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.name}<br>{point.percentage:.1f}%',
              style: {
                fontSize: '.8em',
                textOutline: 'none',
                opacity: 0.7,
              },
              filter: {
                operator: '>',
                property: 'percentage',
                value: 1,
              },
            },
          ],
        },
      },

      series: [
        {
          type: 'pie',
          name: 'Ordens',
          data: [
            {
              name: 'Fechada',
              y: 1515,
            },

            {
              name: 'Aberta',
              y: 1522,
            },
            {
              name: 'Pendente',
              y: 112,
            },
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
        text: 'Quantidade encerrada por mês',
        align: 'center',
      },

      xAxis: {
        categories: [
          'Antonio',
          'Bernardo',
          'Carlos',
          'Danial',
          'Estevão',
          'Fabricio',
          'Guilherme',
          'Hélio',
          'Italo',
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
          colors: ['#a52a2a'],
          type: 'column',
          name: 'Philips',
          colorByPoint: true,
          groupPadding: 0,
          data: [0, 0, 0, 45, 1, 0, 2, 6],
        },
        {
          colors: ['#2aa59d'],
          type: 'column',
          name: 'Relatórios',
          colorByPoint: true,
          groupPadding: 0,
          data: [null],
        },
        {
          colors: ['#5d2aa5'],
          type: 'column',
          name: 'Faturamento',
          colorByPoint: true,
          groupPadding: 0,
          data: [2, 0, 3, 6, 7, 5, 1],
        },
        {
          type: 'column',
          colors: ['#19fb8b'],
          name: 'Financeiro',
          colorByPoint: true,
          groupPadding: 0,
          data: [null, 1, 2, null, 7, null],
        },
        {
          type: 'column',
          colors: ['#ff5353'],
          name: 'Infraestrutura',
          colorByPoint: true,
          groupPadding: 0,
          data: [null, 1, 2, 51, 34, 25],
        },
        {
          type: 'column',
          name: 'Sistemas',
          colors: ['#5d2aa5'],
          colorByPoint: true,
          groupPadding: 0,
          data: [null, 1, 2, 65, 34, 25],
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
        text: 'Quantidade por mês pela lassificação',
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
