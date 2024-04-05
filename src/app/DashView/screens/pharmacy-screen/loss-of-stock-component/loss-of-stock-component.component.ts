import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-loss-of-stock-component',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './loss-of-stock-component.component.html',
  styleUrl: './loss-of-stock-component.component.css',
})
export class LossOfStockComponentComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartLeftTop_One!: Highcharts.Options;
  chartLeftTop_Two!: Highcharts.Options;
  chartLeftBottom!: Highcharts.Options;
  chartRigth_One!: Highcharts.Options;
  chartRigth_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartLeftTop_One = {
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
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
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
          colors: ['#0040ff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [1614.31, 992.83],
        },
        {
          type: 'column',
          name: 'Médias',
          colors: ['#00ecff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [134.53, 82.74],
        },
      ],
    };

    this.chartLeftTop_Two = {
      title: {
        text: 'Perdas por mês',
      },
      subtitle: { text: 'Total: 493 | Média: 81.17' },
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
      legend: {
        enabled: false,
      },

      plotOptions: {
        column: {
          borderRadius: '10%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f}',
          },
        },
      },

      credits: {
        enabled: false,
      },

      series: [
        {
          name: '',
          type: 'column',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['09/23', 3084],
            ['10/23', -2851],
            ['11/23', 87],
            ['12/23', 61],
            ['01/24', 52],
            ['02/24', 60],
          ],
        },
      ],
    };

    this.chartLeftBottom = {
      title: {
        text: 'Valor de perdas por mês',
      },
      subtitle: { text: 'Total: R$ 2.319,41' },
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
        column: {
          borderRadius: '10%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: 'R$ {point.y:.0f}',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: '',
          type: 'column',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['09/23', 2582.37],
            ['10/23', -1610.6],
            ['11/23', 475.47],
            ['12/23', 241.91],
            ['01/24', 325.04],
            ['02/24', 305.22],
          ],
        },
      ],
    };

    this.chartRigth_One = {
      title: {
        text: 'Top 20: Perdas da Material',
        align: 'center',
      },
      subtitle: { text: 'Total: 1.320' },
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
        title: { text: '' },
      },
      legend: {
        enabled: false,
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
            ['Ibuprofeno', 62],
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
            ['Aspirina', 45],
            ['Cetoprofeno', 56],
            ['Hidroxizina', 38],
            ['Outros', 38],
          ],
        },
      ],
    };

    this.chartRigth_Two = {
      title: {
        text: 'Valor de perda por motivo',
      },

      subtitle: { text: 'Total: R$ 2.319,41' },

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

      yAxis: { title: { text: '' } },

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
            format: '{point.y:.0f}',
          },
        },
      },

      series: [
        {
          type: 'bar',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Por quebra', 1662.67],
            ['Por contaminação', 582.07],
            ['Quebra de controlados', 169.62],
            ['Contaminação de controlados', -54.95],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
