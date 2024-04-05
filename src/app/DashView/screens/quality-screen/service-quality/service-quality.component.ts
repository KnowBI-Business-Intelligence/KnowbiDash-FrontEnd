import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-service-quality',
  standalone: true,
  imports: [CommonModule, SkeletonModule, HighchartsChartModule],
  templateUrl: './service-quality.component.html',
  styleUrl: './service-quality.component.css',
})
export class ServiceQualityComponent implements AfterViewInit {
  loadingScreen!: boolean;

  Highcharts: typeof Highcharts = Highcharts;
  chartTop_One!: Highcharts.Options;
  chartTop_Two!: Highcharts.Options;
  chartTop_Three!: Highcharts.Options;

  constructor() {
    this.loadingScreen = true;
  }

  ngAfterViewInit(): void {
    this.chartTop_One = {
      title: {
        text: 'Atendimentos por município',
        align: 'center',
      },
      subtitle: { text: 'Total: 3.497' },
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
          type: 'bar',
          name: 'Atendimentos',
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
            ['São Paulo', 681],
            ['Rio de Janeiro', 652],
            ['Salvador', 351],
            ['Brasília', 341],
            ['Fortaleza', 298],
            ['Belo Horizonte', 264],
            ['Manaus', 242],
            ['Curitiba', 156],
            ['Recife', 123],
            ['Goiânia', 111],
            ['Belém', 92],
            ['Porto Alegre', 45],
            ['São Luís', 36],
            ['Natal', 25],
            ['Campo Grande', 12],
          ],
        },
      ],
    };

    this.chartTop_Two = {
      title: {
        text: 'Atendimentos por faixa etária',
        align: 'center',
      },
      subtitle: { text: 'Total: 3.497' },
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
          type: 'bar',
          name: 'Atendimentos',
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
            ['101 - 105', 681],
            ['91 - 100', 652],
            ['21 - 90', 351],
            ['31 - 80', 341],
            ['41 - 70', 298],
            ['51 - 60', 264],
            ['61 - 50', 242],
            ['26 - 40', 156],
            ['31 - 35', 123],
            ['26 - 30', 111],
            ['21 - 25', 92],
            ['16 - 20', 45],
            ['11 - 15', 36],
            ['6 - 10', 25],
            ['0 - 5', 12],
          ],
        },
      ],
    };

    this.chartTop_Three = {
      title: {
        text: 'Atendimento por sexo',
        align: 'center',
      },
      subtitle: { text: 'Total: 3.497' },
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
          name: 'Atendimentos',
          colors: [
            '#0040ff',
            '#0055ff',
            '#00ecff',
            '#00ffff',
            '#00ffec',
            '#00ffab',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Feminino', 1968],
            ['Masculino', 1520],
            ['Indeterminado', 7],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
