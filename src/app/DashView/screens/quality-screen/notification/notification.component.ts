import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartTop_One!: Highcharts.Options;
  chartTop_Two!: Highcharts.Options;
  chartTop_Three!: Highcharts.Options;
  chartBottom_One!: Highcharts.Options;
  chartBottom_Two!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartTop_One = {
      title: {
        text: 'Notificações por mês',
        align: 'center',
      },
      subtitle: { text: 'Total: 300' },
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
      series: [
        {
          type: 'column',
          name: 'Notificações',
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
            ['01/2024', 97],
            ['02/2024', 104],
            ['03/2024', 99],
          ],
        },
      ],
    };

    this.chartTop_Two = {
      title: {
        text: 'Notificações por ano',
        align: 'center',
      },
      subtitle: { text: 'Total: 300' },
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
      series: [
        {
          type: 'column',
          name: 'Notificações',
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
          data: [['2024', 300]],
        },
      ],
    };

    this.chartTop_Three = {
      title: {
        text: 'Média de notificação por mês',
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
      series: [
        {
          type: 'column',
          name: 'Notificação',
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
          data: [['2024', 100]],
        },
      ],
    };

    this.chartBottom_One = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Notificações por período',
      },
      subtitle: { text: 'Total: 300' },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.y:.f} | {point.name:.2f}',
            },
          ],
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Notificações',
          data: [
            {
              name: 'Manhã',
              y: 120,
            },
            {
              name: 'Tarde',
              y: 137,
            },
            {
              name: 'Noite',
              y: 43,
            },
          ],
        },
      ],
    };

    this.chartBottom_Two = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Média de notificações por período',
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              format: '{point.y:.2f} | {point.name:.2f}',
            },
          ],
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Notificações',
          data: [
            {
              name: 'Manhã',
              y: 40,
            },
            {
              name: 'Tarde',
              y: 45.67,
            },
            {
              name: 'Noite',
              y: 14.33,
            },
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
