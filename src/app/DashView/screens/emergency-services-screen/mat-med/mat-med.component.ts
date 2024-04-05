import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-mat-med',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './mat-med.component.html',
  styleUrl: './mat-med.component.css',
})
export class MatMedComponent implements AfterViewInit {
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
        text: 'Média de preço por atendimento por mês',
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
            format: 'R$ {point.y:.2f}',
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Média',
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
            ['02/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['03/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['04/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['05/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['06/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['07/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['08/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['09/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['10/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['11/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['12/23', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['01/24', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['02/24', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
            ['03/24', Number((Math.random() * (110 - 60) + 60).toFixed(2))],
          ],
        },
      ],
    };

    this.chartTop_Two = {
      title: {
        text: 'Média de custo por atendimento por mês',
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
            format: 'R$ {point.y:.2f}',
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Média',
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
            ['02/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['03/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['04/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['05/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['06/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['07/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['08/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['09/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['10/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['11/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['12/23', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['01/24', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['02/24', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
            ['03/24', Number((Math.random() * (580 - 60) + 60).toFixed(2))],
          ],
        },
      ],
    };

    this.chartBottom_One = {
      title: {
        text: 'Custo por mês',
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
            format: 'R$ {point.y:.2f}',
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Média',
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
            [
              '02/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '03/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '04/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '05/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '06/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '07/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '08/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '09/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '10/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '11/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '12/23',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '01/24',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '02/24',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
            [
              '03/24',
              Number((Math.random() * (335829 - 79999) + 79999).toFixed(2)),
            ],
          ],
        },
      ],
    };

    this.chartBottom_Two = {
      title: {
        text: 'Faturamento por mês',
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
            format: 'R$ {point.y:.2f}',
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Média',
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
            [
              '02/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '03/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '04/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '05/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '06/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '07/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '08/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '09/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '10/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '11/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '12/23',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '01/24',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '02/24',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
            [
              '03/24',
              Number((Math.random() * (65178 - 1304) + 1304).toFixed(2)),
            ],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
