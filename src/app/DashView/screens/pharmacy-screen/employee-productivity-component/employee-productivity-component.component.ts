import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-employee-productivity-component',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './employee-productivity-component.component.html',
  styleUrl: './employee-productivity-component.component.css',
})
export class EmployeeProductivityComponentComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartTop!: Highcharts.Options;
  chartMiddle_One!: Highcharts.Options;
  chartMiddle_Two!: Highcharts.Options;
  chartBottom!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartTop = {
      title: {
        text: 'Lotes atendidos por mês',
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
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'column',
          name: 'Atendidos',
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
            ['03/2023', 33365],
            ['04/2023', 27895],
            ['05/2023', 24857],
            ['06/2023', 31642],
            ['07/2023', 29561],
            ['08/2023', 30256],
            ['09/2023', 30345],
            ['10/2023', 33275],
            ['11/2023', 31920],
            ['12/2023', 34541],
            ['01/2024', 37009],
            ['02/2024', 35062],
          ],
        },
      ],
    };

    this.chartMiddle_One = {
      title: {
        text: 'Lotes dispensados por usuário',
        align: 'center',
      },
      subtitle: { text: 'Total: 172.562' },
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
        title: { text: '' },
        min: 0,
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
            ['Alice Johnson', 25000],
            ['Bob Smith', 23000],
            ['Charlie Brown', 21000],
            ['David Lee', 19000],
            ['Eva Martinez', 17000],
            ['Frank Rodriguez', 15000],
            ['Grace Davis', 13000],
            ['Hannah Taylor', 11000],
            ['Isaac Clark', 9000],
            ['Julia Anderson', 7000],
            ['Kevin Harris', 5000],
            ['Lily Thompson', 5000],
            ['Michael Wilson', 5000],
            ['Nora Garcia', 5000],
            ['Outros', 4562],
          ],
        },
      ],
    };

    this.chartMiddle_Two = {
      title: {
        text: 'Materiais dispensados por usuário',
        align: 'center',
      },
      subtitle: { text: 'Total: 365.000' },
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
            ['Alice Johnson', 60000],
            ['Bob Smith', 55000],
            ['Charlie Brown', 50000],
            ['David Lee', 45000],
            ['Eva Martinez', 40000],
            ['Frank Rodriguez', 35000],
            ['Grace Davis', 30000],
            ['Hannah Taylor', 25000],
            ['Isaac Clark', 20000],
            ['Julia Anderson', 15000],
            ['Kevin Harris', 12000],
            ['Lily Thompson', 11000],
            ['Michael Wilson', 10000],
            ['Nora Garcia', 10000],
            ['Outros', 6000],
          ],
        },
      ],
    };

    this.chartBottom = {
      title: {
        text: 'Prescritos por mês',
        align: 'center',
      },
      subtitle: { text: 'Total: 1.535' },
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
          type: 'column',
          name: 'Prescrito',
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
            ['08/2023', 165],
            ['09/2023', 120],
            ['10/2023', 322],
            ['11/2023', 220],
            ['12/2023', 265],
            ['01/2024', 319],
            ['02/2024', 289],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
