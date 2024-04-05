import { CommonModule } from '@angular/common';
import { AfterContentInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { CardsNumberOfComponent } from '../../../components/cards-number-of/cards-number-of.component';

@Component({
  selector: 'app-accounts-receivable',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardsNumberOfComponent,
    SkeletonModule,
    HighchartsChartModule,
  ],
  templateUrl: './accounts-receivable.component.html',
  styleUrl: './accounts-receivable.component.css',
})
export class AccountsReceivableComponent implements AfterContentInit {
  loadingScreen: boolean;

  Highcharts: typeof Highcharts = Highcharts;

  chartLine!: Highcharts.Options;
  chartBarRace!: Highcharts.Options;

  chartPie_One!: Highcharts.Options;
  chartPie_Two!: Highcharts.Options;
  chartBar_One!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterContentInit(): void {
    this.chartLine = {
      title: {
        text: 'Valor total X recebido',
      },

      xAxis: {
        allowDecimals: true,
        categories: ['Jan', 'Fev', 'Mar', 'Abr'],
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
          type: 'areaspline',
          name: 'Valor total',
          data: [87780, 100320, 112860, 660],
        },
        {
          type: 'areaspline',
          name: 'Valor recebido',
          data: [48177, 54003, 60754, 0],
        },
      ],
    };

    this.chartBarRace = {
      chart: {
        animation: {
          duration: 500,
        },
        marginRight: 50,
      },
      title: {
        text: 'Valor em aberto por pesso',
        align: 'center',
      },

      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'category',
        categories: [
          'Pessoa 1',
          'Pessoa 2',
          'Pessoa 3',
          'Pessoa 4',
          'Pessoa 5',
          'Pessoa 6',
          'Pessoa 7',
          'Pessoa 8',
          'Pessoa 9  ',
          'Pessoa 10',
          'Pessoa 11 ',
          'Pessoa 12 ',
          'Pessoa 13',
        ],
      },
      yAxis: {
        opposite: true,
        tickPixelInterval: 150,
        title: {
          text: null,
        },
      },
      plotOptions: {
        series: {
          animation: false,
          borderWidth: 0,
          dataSorting: {
            enabled: true,
            matchByName: true,
          },
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Atendimentos',
          data: [
            16.261, 10.915, 9.128, 9.237, 7.346, 5.543, 5.845, 5.354, 4.452,
            3.108, 3.095, 2.058, 2.054,
          ],
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 550,
            },
            chartOptions: {
              xAxis: {
                visible: false,
              },
              subtitle: {
                x: 0,
              },
              plotOptions: {
                series: {
                  dataLabels: [
                    {
                      enabled: true,
                      y: 8,
                    },
                    {
                      enabled: true,
                      format: '{point.name}',
                      y: -8,
                      style: {
                        fontWeight: 'normal',
                        opacity: 0.7,
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };

    this.chartPie_One = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Valor porsituação',
      },
      tooltip: {
        valueSuffix: '%',
      },

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Porcentagem',
          data: [
            {
              name: 'Aberto',
              y: 45.98,
            },
            {
              name: 'Liquidado',
              sliced: true,
              selected: true,
              y: 54.02,
            },
          ],
        },
      ],
    };

    this.chartPie_Two = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Valor total por portador',
      },
      tooltip: {
        valueSuffix: '%',
      },

      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Porcentagem',
          data: [
            {
              name: 'Recebimento de aporte',
              y: 100,
            },
          ],
        },
      ],
    };

    this.chartBar_One = {
      title: {
        text: 'Valor por prazo de pagamento',
        align: 'center',
      },

      xAxis: {
        categories: [''],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Valores',
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
          type: 'bar',
          name: 'Aberto - em atraso',
          data: [13868448],
        },
        {
          type: 'bar',
          name: 'Pago após prazo',
          data: [11623788],
        },
        {
          type: 'bar',
          name: 'Pago no prazo',
          data: [4669764],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
