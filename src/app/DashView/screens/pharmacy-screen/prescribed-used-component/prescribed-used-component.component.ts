import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-prescribed-used-component',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './prescribed-used-component.component.html',
  styleUrl: './prescribed-used-component.component.css',
})
export class PrescribedUsedComponentComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartBarTop_One!: Highcharts.Options;
  chartBarTop_Two!: Highcharts.Options;
  chartBarMiddle_One!: Highcharts.Options;
  chartBarBottom_One!: Highcharts.Options;
  chartBarBottom_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartBarTop_One = {
      title: {
        text: 'Prescrito por mês',
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
          text: 'Quantidade',
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          type: 'column',
          name: 'Prescito',
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
            ['03/23', 1268],
            ['04/23', 1481],
            ['05/23', 2272],
            ['06/23', 2828],
            ['07/23', 2388],
            ['08/23', 2826],
            ['09/23', 2140],
            ['10/23', 1848],
            ['11/23', 2437],
            ['12/23', 2908],
            ['01/24', 4042],
            ['02/24', 1486],
          ],
        },
      ],
    };

    this.chartBarTop_Two = {
      title: {
        text: 'Realizadas por mês',
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
          text: 'Quantidade',
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          type: 'column',
          name: 'Realizadas',
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
            ['03/23', 1184],
            ['04/23', 1456],
            ['05/23', 2776],
            ['06/23', 2323],
            ['07/23', 2813],
            ['08/23', 2092],
            ['09/23', 1835],
            ['10/23', 2159],
            ['11/23', 2420],
            ['12/23', 2892],
            ['01/24', 4028],
            ['02/24', 1431],
          ],
        },
      ],
    };

    this.chartBarMiddle_One = {
      title: {
        text: 'Prescrito por mês',
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
          text: 'Valores em %',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: '%',
      },

      series: [
        {
          type: 'column',
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
            ['02/2023', 6.62],
            ['03/2023', 1.69],
            ['04/2023', 4.14],
            ['05/2023', 1.84],
            ['06/2023', 2.72],
            ['07/2023', 0.46],
            ['08/2023', 2.24],
            ['09/2023', 0.7],
            ['10/2023', 0.37],
            ['11/2023', 0.7],
            ['12/2023', 0.55],
            ['01/2024', 0.35],
            ['02/2024', 3.9],
          ],
        },
      ],
    };

    this.chartBarBottom_One = {
      title: {
        text: 'Realizada por convênio',
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
          text: 'Realizada',
        },
      },
      legend: {
        enabled: false,
      },

      series: [
        {
          type: 'bar',
          name: 'Realizada',
          colors: [
            '#e6ffe6',
            '#d9ffd9',
            '#ccffcc',
            '#bfffbf',
            '#b3ffb3',
            '#a6ffa6',
            '#99ff99',
            '#8cff8c',
            '#7fff7f',
            '#73ff73',
            '#66ff66',
            '#59ff59',
            '#4cff4c',
            '#40ff40',
            '#33ff33',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Convênio 1', 13609],
            ['Convênio 2', 8238],
            ['Convênio 3', 7650],
            ['Convênio 4', 468],
            ['Convênio 5', 460],
            ['Convênio 6', 153],
            ['Convênio 7', 120],
            ['Convênio 8', 67],
            ['Convênio 9', 29],
            ['Convênio 10', 12],
            ['Convênio 11', 5],
            ['Convênio 12', 1],
          ],
        },
      ],
    };

    this.chartBarBottom_Two = {
      title: {
        text: 'Prescrito por médico',
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
          text: 'Realizada',
        },
      },
      legend: {
        enabled: false,
      },

      series: [
        {
          type: 'bar',
          name: 'Realizada',
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
            ['Médico 1', 3984],
            ['Médico 2', 3640],
            ['Médico 3', 3200],
            ['Médico 4', 1965],
            ['Médico 5', 1869],
            ['Médico 6', 1759],
            ['Médico 7', 1507],
            ['Médico 8', 1154],
            ['Médico 9', 965],
            ['Médico 10', 658],
            ['Médico 11', 501],
            ['Médico 12', 356],
            ['Outros', 8164],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
