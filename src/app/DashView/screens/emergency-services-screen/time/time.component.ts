import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css',
})
export class TimeComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chart_One!: Highcharts.Options;
  chart_Two!: Highcharts.Options;
  chart_Three!: Highcharts.Options;
  chart_Four!: Highcharts.Options;
  chart_Five!: Highcharts.Options;
  chart_Six!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chart_One = {
      title: {
        text: 'Média de espera',
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
      plotOptions: {
        column: {
          borderRadius: '5%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} min',
          },
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: { valueSuffix: ' min' },
      series: [
        {
          type: 'column',
          name: 'Tempo:',
          colors: ['#0040ff', '#00ffc1', '#00ffab'],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['01/2024', 26],
            ['02/2024', 29],
            ['03/2024', 27],
          ],
        },
      ],
    };

    this.chart_Two = {
      title: {
        text: 'Média de Triagem',
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
        column: {
          borderRadius: '5%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} min',
          },
        },
      },
      tooltip: { valueSuffix: ' min' },
      series: [
        {
          type: 'column',
          name: 'Tempo:',
          colors: ['#0040ff', '#00ffc1', '#00ffab'],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['01/2024', 15],
            ['02/2024', 19],
            ['03/2024', 17],
          ],
        },
      ],
    };

    this.chart_Three = {
      title: {
        text: 'Média de consulta',
        align: 'center',
      },
      plotOptions: {
        column: {
          borderRadius: '5%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f} min',
          },
        },
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
      tooltip: { valueSuffix: ' min' },
      series: [
        {
          type: 'column',
          name: 'Tempo:',
          colors: ['#0040ff', '#00ffc1', '#00ffab'],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['01/2024', 37],
            ['02/2024', 38],
            ['03/2024', 57],
          ],
        },
      ],
    };

    this.chart_Four = {
      title: {
        text: 'Classificação de senha',
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

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.y:.1f}',
              style: {
                fontSize: '.8em',
                textOutline: 'none',
                opacity: 0.7,
              },
            },
          ],
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
          type: 'bar',
          name: 'Classificação',
          colors: [
            '#0040ff',
            '#006bff',
            '#00ecff',
            '#00ffff',
            '#00ffd6',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            {
              name: 'Sem senha',
              y: 283,
            },
            {
              name: 'Até 5min',
              y: 156,
            },
            {
              name: '5min a 10min',
              y: 83,
            },
            {
              name: '10min a 20min',
              y: 134,
            },
            {
              name: '20min a 1h',
              y: 183,
            },
            {
              name: 'Mais que 1h',
              y: 69,
            },
          ],
        },
      ],
    };

    this.chart_Five = {
      title: {
        text: 'Classificação de triagem',
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

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.y:.1f}',
              style: {
                fontSize: '.8em',
                textOutline: 'none',
                opacity: 0.7,
              },
            },
          ],
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
          type: 'bar',
          name: 'Classificação',
          colors: [
            '#0040ff',
            '#006bff',
            '#00ecff',
            '#00ffff',
            '#00ffd6',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            {
              name: 'Sem triagem',
              y: 48,
            },
            {
              name: 'Até 5min',
              y: 530,
            },
            {
              name: '5min a 10min',
              y: 223,
            },
            {
              name: '10min a 20min',
              y: 46,
            },
            {
              name: '20min a 1h',
              y: 52,
            },
            {
              name: 'Mais que 1h',
              y: 38,
            },
          ],
        },
      ],
    };

    this.chart_Six = {
      title: {
        text: 'Classificação de consulta',
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

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.y:.1f}',
              style: {
                fontSize: '.8em',
                textOutline: 'none',
                opacity: 0.7,
              },
            },
          ],
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
          type: 'bar',
          name: 'Classificação',
          colors: [
            '#0040ff',
            '#006bff',
            '#00ecff',
            '#00ffff',
            '#00ffd6',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            {
              name: 'Sem consulta',
              y: 53,
            },
            {
              name: 'Até 5min',
              y: 721,
            },
            {
              name: '5min a 10min',
              y: 72,
            },
            {
              name: '10min a 20min',
              y: 64,
            },
            {
              name: '20min a 1h',
              y: 29,
            },
            {
              name: 'Mais que 1h',
              y: 7,
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
