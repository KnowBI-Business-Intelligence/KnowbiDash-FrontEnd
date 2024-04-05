import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-production-time-component',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './production-time-component.component.html',
  styleUrl: './production-time-component.component.css',
})
export class ProductionTimeComponentComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartBar_One!: Highcharts.Options;
  chartBar_Two!: Highcharts.Options;
  chartBar_Three!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartBar_One = {
      title: {
        text: 'Tempo médio de produção por mês',
        align: 'center',
      },
      subtitle: {
        text: 'Média geral 07:38:00',
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
          text: 'Minutos',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' min',
      },

      series: [
        {
          type: 'column',
          name: 'Média de produção',
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
            ['09/2023', 425],
            ['10/2023', 486],
            ['11/2023', 430],
            ['12/2023', 412],
            ['01/2024', 436],
            ['02/2024', 465],
          ],
        },
      ],
    };

    this.chartBar_Three = {
      title: {
        text: 'Tempo médio de produção por colaborador',
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
          text: 'Produção em minutos',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' min',
      },

      series: [
        {
          type: 'bar',
          name: 'Produção',
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
            ['Colaborador 1', 356],
            ['Colaborador 2', 360],
            ['Colaborador 3', 268],
            ['Colaborador 4', 320],
            ['Colaborador 5', 352],
            ['Colaborador 6', 342],
            ['Colaborador 7', 347],
            ['Colaborador 8', 369],
            ['Colaborador 9', 380],
            ['Colaborador 10', 364],
            ['Colaborador 11', 312],
            ['Colaborador 12', 319],
            ['Colaborador 13', 366],
            ['Outros', 395],
          ],
        },
      ],
    };

    this.chartBar_Two = {
      title: {
        text: 'Tempo médio de produção por setor',
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
          text: 'Produção em minutos',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' min',
      },

      series: [
        {
          type: 'bar',
          name: 'Produção',
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
            ['UTI 1', 367],
            ['Internação 2', 360],
            ['UTI 5', 268],
            ['Internação 3', 320],
            ['Internação 1', 352],
            ['Emergência', 11],
            ['RPA CC 5', 347],
            ['Centro Cirúrgico 6', 369],
            ['Isolamento', 210],
            ['Cardiologia', 186],
            ['Centro Cirúrgico 4', 186],
            ['Consultório Emergência', 31],
            ['Outros', 305],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
