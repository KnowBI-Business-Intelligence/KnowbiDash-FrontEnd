import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
})
export class RecipeComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;

  chartLeftTop_One!: Highcharts.Options;
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
        text: 'Receita por período',
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
          data: [
            ['09/23', 36541],
            ['10/23', 25415],
            ['11/23', 29584],
            ['12/23', 32546],
            ['01/24', 23698],
            ['02/24', 26413],
            ['03/24', 23564],
          ],
        },
      ],
    };

    this.chartLeftBottom_One = {
      title: {
        text: 'Receita por tipo de atendimento',
      },

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.y:.0f}m | {point.name}',
              style: {
                fontSize: '.6em',
                textOutline: 'none',
                opacity: 0.7,
              },
            },
          ],
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Atendimento',
          data: [
            {
              name: 'Ambulatorial',
              y: 150,
            },
            {
              name: 'Externo',
              y: 106,
            },
            {
              name: 'Internado',
              y: 1615,
            },
            {
              name: 'Pronto Atendimento',
              y: 101,
            },
          ],
        },
      ],
    };

    this.chartLeftBottom_Two = {
      title: {
        text: 'Receita por tipo de convênio',
      },

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.y:.0f}m | {point.name}',
              style: {
                fontSize: '.6em',
                textOutline: 'none',
                opacity: 0.7,
              },
            },
          ],
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Atendimento',
          data: [
            {
              name: 'Auto gestão',
              y: 150,
            },
            {
              name: 'Convênio',
              y: 106,
            },
            {
              name: 'Particular',
              y: 1615,
            },
          ],
        },
      ],
    };

    this.chartRigth_One = {
      title: {
        text: 'Top 10: Receita por setor',
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
          name: 'Total',
          type: 'bar',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Setor A', 7945],
            ['Setor B', 6512],
            ['Setor C', 6123],
            ['Setor D', 5315],
            ['Setor E', 3567],
            ['Setor F', 3197],
            ['Setor G', 2581],
            ['Setor H', 2015],
            ['Setor I', 1502],
            ['Setor J', 658],
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

    this.chartRigth_Two = {
      title: {
        text: 'Top 10: Receita por convênio',
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
            format: '{point.y} m',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: 'Total',
          type: 'bar',
          colorByPoint: true,
          groupPadding: 0,
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
