import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-inventory-component',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './inventory-component.component.html',
  styleUrl: './inventory-component.component.css',
})
export class InventoryComponentComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartLeftTop_One!: Highcharts.Options;
  chartLeftTop_Two!: Highcharts.Options;
  chartRigthTop!: Highcharts.Options;
  chartRigthBottom_One!: Highcharts.Options;
  chartRigthBottom_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartLeftTop_One = {
      title: {
        text: 'Inventários por mês',
      },
      subtitle: {
        text: 'Total 990',
      },
      xAxis: {
        categories: ['09/23', '10/23', '11/23', '12/23', '01/24', '02/24'],
        accessibility: {
          description: 'Meses do ano',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {},
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f}',
          },
        },
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1,
          },
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Quantidade',
          type: 'spline',
          marker: {
            symbol: 'cicle',
          },
          data: [118, 161, 124, 245, 155, 187],
        },
      ],
    };

    this.chartLeftTop_Two = {
      title: {
        text: 'Itens inventariados por mês',
      },
      xAxis: {
        categories: ['09/23', '10/23', '11/23', '12/23', '01/24', '02/24'],
        accessibility: {
          description: 'Meses do ano',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.0f}',
          },
        },
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1,
          },
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Quantidade',
          type: 'spline',
          marker: {
            symbol: 'cicle',
          },
          data: [332, 548, 720, 685, 252, 393],
        },
      ],
    };

    this.chartRigthTop = {
      title: {
        text: 'Tempo médio de inventário por mês',
      },
      subtitle: { text: 'Total: 02:29:09' },
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
      tooltip: { valueSuffix: ' min' },
      plotOptions: {
        column: {
          borderRadius: '10%',
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y} min',
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: 'Tempo',
          type: 'column',
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['09/23', 5],
            ['10/23', 780],
            ['11/23', 54],
            ['12/23', 10],
            ['01/24', 20],
            ['02/24', 7],
          ],
        },
      ],
    };

    this.chartRigthBottom_One = {
      title: {
        text: 'Inventários por contagem',
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
        title: { text: '' },
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
            format: '{point.y}',
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Quantidade',
          colors: [
            '#0040ff',
            '#0055ff',
            '#006bff',
            '#0080ff',
            '#0096ff',
            '#00ffc1',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['1 Contagem', 794],
            ['2 Contagem', 135],
            ['3 Contagem', 56],
            ['4 Contagem', 5],
          ],
        },
      ],
    };

    this.chartRigthBottom_Two = {
      title: {
        text: 'Inventários por status',
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
        title: { text: '' },
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
            format: '{point.y}',
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Quantidade',
          colors: [
            '#0040ff',
            '#0055ff',
            '#006bff',
            '#0080ff',
            '#0096ff',
            '#00ffc1',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Finalizado', 990],
            ['Cancelado', 33],
            ['Aguardando contagem', 9],
            ['Contagem', 4],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
