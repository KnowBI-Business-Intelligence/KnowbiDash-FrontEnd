import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';
import { StorageService } from '../../../services/service/user/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { ChartsService } from '../../../services/service/charts/charts.service';

@Component({
  selector: 'app-chart-screen',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './chart-screen.component.html',
  styleUrl: './chart-screen.component.css',
})
export class ChartScreenComponent implements AfterViewInit, OnInit {
  loadingScreen!: boolean;
  Highcharts: typeof Highcharts = Highcharts;

  chartGroupsData: Highcharts.Options[] = [];
  chartObject: any;

  chartLeftTop_One!: Highcharts.Options;
  chartLeftBottom_One!: Highcharts.Options;
  chartLeftBottom_Two!: Highcharts.Options;
  chartRigth_One!: Highcharts.Options;
  chartRigth_Two!: Highcharts.Options;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private chartService: ChartsService
  ) {
    this.loadingScreen = true;
  }

  getCharts(): void {
    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.chartService.getCharts(headers).subscribe({
      next: (data) => {
        this.loadData(data);
      },
    });
  }

  loadData(chartData: any) {
    this.chartObject = JSON.parse(localStorage.getItem('chartGroup') || 'null');
    this.chartGroupsData = [];
    console.log('chartobjetc ', this.chartObject);

    chartData.forEach((dataItem: any) => {
      console.log('chartdata ', dataItem.chartGroup.id);
      if (dataItem.chartGroup.id == this.chartObject) {
        console.log('chartdata ', dataItem);
      }
      /*this.chartObject.forEach((chartGroup: any) => {
        if (dataItem.id === chartGroup.id) {
          console.log(dataItem);
          const seriesData: any[] = [];

          dataItem.xAxisColumns.forEach((xAxisColumn: any, index: number) => {
            const yAxisColumn = dataItem.yAxisColumns[index];
            const seriesName = yAxisColumn ? yAxisColumn.name[0] : '';
            const seriesValues = xAxisColumn.data.map(
              (value: any, i: number) => {
                const yAxisData = dataItem.yAxisColumns[0].data;
                const name = yAxisData ? yAxisData[i] : ''; // Se yAxisData estiver indefinido, definimos name como uma string vazia
                return {
                  name: name,
                  y: parseFloat(value),
                };
              }
            );

            seriesData.push({
              name: seriesName,
              data: seriesValues,
            });
          });

          const chartConfig: Highcharts.Options = {
            chart: {
              type: dataItem.graphType,
            },
            title: {
              text: dataItem.title,
            },
            xAxis: {
              categories: dataItem.yAxisColumns[0].data,
              title: {
                text: dataItem.yAxisColumns[0].name[0],
              },
            },
            yAxis: {
              title: {
                text: dataItem.xAxisColumns[0].name[0],
              },
            },
            series: seriesData,
            tooltip: {
              shared: true,
            },
          };

          this.chartGroupsData.push(chartConfig);
        }
      });*/
    });
  }

  backScreen() {
    this.router.navigate(['/content/main/chartgroup']);
  }

  ngOnInit(): void {
    this.getCharts();
  }

  ngAfterViewInit(): void {
    /*this.chartLeftTop_One = {
      title: {
        text: 'Receita por período',
        align: 'center',
      },

      xAxis: {
        type: 'category',
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: '12px',
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

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);*/
  }
}
