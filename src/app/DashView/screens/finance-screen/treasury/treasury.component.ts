import { CommonModule } from '@angular/common';
import { AfterContentInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-treasury',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './treasury.component.html',
  styleUrl: './treasury.component.css',
})
export class TreasuryComponent implements AfterContentInit {
  loadingScreen: boolean;

  Highcharts: typeof Highcharts = Highcharts;

  chartArea!: Highcharts.Options;
  chartColumn!: Highcharts.Options;
  chartLine!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterContentInit(): void {
    this.chartArea = {
      title: {
        text: 'Receita anual',
      },

      xAxis: {
        allowDecimals: true,
        categories: ['2020', '2021', '2022', '2023'],
      },
      yAxis: {
        title: {
          text: '',
        },
      },

      tooltip: {
        pointFormat: '{series.name} <b>{point.y:,.0f}</b><br/>',
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      series: [
        {
          marker: {
            symbol: 'circle',
          },
          type: 'areaspline',
          name: 'Receita Protocolo',
          data: [4087609, 57872156, 52929295, 67872156],
        },
        {
          marker: {
            symbol: 'circle',
          },
          type: 'areaspline',
          name: 'Receita com Título',
          data: [40876092, 56872156, 39206790, 51206790],
        },
        {
          marker: {
            symbol: 'circle',
          },
          type: 'areaspline',
          name: 'Receita Liquidada',
          data: [427101, 3316245, 4829852, 6829852],
        },
      ],
    };

    this.chartColumn = {
      title: {
        text: 'Evolução da receita',
        align: 'center',
      },

      xAxis: {
        categories: [
          '10/2023',
          '11/2023',
          '12/2023',
          '01/2024',
          '02/2024',
          '03/2024',
        ],
        crosshair: true,
        accessibility: {
          description: 'Meses do ano',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
      },
      tooltip: {
        valuePrefix: 'R$ ',
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          type: 'column',
          name: 'Protocolo',
          data: [406292, 260000, 107000, 68300, 27500, 14500],
        },
        {
          type: 'column',
          name: 'Título',
          data: [306292, 136000, 57000, 141000, 210180, 87000],
        },
        {
          type: 'column',
          name: 'Liquidada',
          data: [106292, 136000, 57000, 145000, 107180, 77000],
        },
      ],
    };

    this.chartLine = {
      title: {
        text: 'Receita com Título',
      },
      subtitle: {
        text: 'Unimed, Bradesco e GEAP',
      },

      xAxis: {
        categories: [
          '09/2023',
          '10/2023',
          '11/2023',
          '12/2023',
          '01/2024',
          '02/2024',
          '03/2024',
        ],
        accessibility: {
          description: 'Meses do ano',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          format: 'R${value}',
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1,
          },
        },
      },
      series: [
        {
          type: 'spline',
          name: 'Unimed',
          marker: {
            symbol: 'circle',
          },
          data: [0, 0, 0, 356, 450, 395, 0],
        },
        {
          type: 'spline',
          name: 'Bradesco',
          marker: {
            symbol: 'circle',
          },
          data: [
            8253.5, 484747.23, 6852.05, 923693.38, 1024319.96, 485604.69,
            485436.23,
          ],
        },
        {
          type: 'spline',
          name: 'GEAP',
          marker: {
            symbol: 'circle',
          },
          data: [3773712.17, 0, 0, 395.95, 0, 0, 0],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
