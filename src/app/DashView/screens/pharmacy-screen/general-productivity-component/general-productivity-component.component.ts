import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-general-productivity-component',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './general-productivity-component.component.html',
  styleUrl: './general-productivity-component.component.css',
})
export class GeneralProductivityComponentComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;

  chartLeftTop_One!: Highcharts.Options;
  chartLeftTop_Two!: Highcharts.Options;
  chartLeftBottom_One!: Highcharts.Options;
  chartLeftBottom_Two!: Highcharts.Options;
  chartRigth_One!: Highcharts.Options;
  chartRigth_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartLeftTop_One = {
      title: {
        text: 'Lotes atendidos por ano',
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
      tooltip: { valueSuffix: ' lotes' },
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
          data: [436348, 376333],
        },
        {
          type: 'column',
          name: 'Média',
          colors: ['#00ecff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [36362.33, 31361.08],
        },
      ],
    };

    this.chartLeftTop_Two = {
      title: {
        text: 'Total e média mat/med',
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
      tooltip: { valueSuffix: ' mat/med' },
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
          data: [90976, 95238],
        },
        {
          type: 'column',
          name: 'Médias',
          colors: ['#00ecff'],
          colorByPoint: true,
          groupPadding: 0,
          data: [75811.33, 7936.5],
        },
      ],
    };

    this.chartLeftBottom_One = {
      title: {
        text: 'Lotes atendidos por mês',
      },
      subtitle: { text: 'Média: 33.703,50' },
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
            format: '{point.y}',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          colors: [
            '#9b20d9',
            '#9215ac',
            '#861ec9',
            '#7a17e6',
            '#7010f9',
            '#691af3',
          ],
          name: 'Lotes',
          type: 'column',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['09/23', 30326],
            ['10/23', 33285],
            ['11/23', 32045],
            ['12/23', 34366],
            ['01/24', 37067],
            ['02/24', 35132],
          ],
        },
      ],
    };

    this.chartLeftBottom_Two = {
      title: {
        text: '% lotes atendidos por mês',
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
        column: {
          borderRadius: '10%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}%',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          colors: [
            '#9b20d9',
            '#9215ac',
            '#861ec9',
            '#7a17e6',
            '#7010f9',
            '#691af3',
          ],
          name: 'Lotes',
          type: 'column',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['09/23', 88.99],
            ['10/23', 88.02],
            ['11/23', 86.43],
            ['12/23', 87.45],
            ['01/24', 85.83],
            ['02/24', 85.89],
          ],
        },
      ],
    };

    this.chartRigth_One = {
      title: {
        text: '% mat/med devolvidos por mês',
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
        column: {
          borderRadius: '10%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}%',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: 'Mat/Med',
          type: 'column',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['09/23', 7.67],
            ['10/23', 8.98],
            ['11/23', 8.45],
            ['12/23', 8.65],
            ['01/24', 8.52],
            ['02/24', 8.92],
          ],
          colors: [
            '#9b20d9',
            '#9215ac',
            '#861ec9',
            '#7a17e6',
            '#7010f9',
            '#691af3',
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
