import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';

export interface Materials {
  grupo: string;
  tipo: string;
  material_estoque: string;
  qt_consumo: number;
  un_medida: string;
  valor_consumo: string;
}

@Component({
  selector: 'app-consumption-component',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    HighchartsChartModule,
    MatTableModule,
  ],
  templateUrl: './consumption-component.component.html',
  styleUrl: './consumption-component.component.css',
})
export class ConsumptionComponentComponent implements OnInit {
  loadingScreen: boolean;
  Highcharts: typeof Highcharts = Highcharts;

  chartBar_One!: Highcharts.Options;
  chartBar_Two!: Highcharts.Options;
  chartBar_Three!: Highcharts.Options;

  displayedColumns = [
    'grupo',
    'tipo',
    'material_estoque',
    'qt_consumo',
    'un_medida',
    'valor_consumo',
  ];

  dataSource: Materials[] = [
    {
      grupo: 'Materiais de Embalagens',
      tipo: 'Material',
      material_estoque: 'Copo Descartável',
      qt_consumo: 1.0079,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'Material Medico Hospitalar e Odontológico',
      tipo: 'Material',
      material_estoque: 'Luva P Procedimento',
      qt_consumo: 4.0026,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'Material Medico Hospitalar e Odontológico',
      tipo: 'Material',
      material_estoque: 'Luva M Procedimento',
      qt_consumo: 6.941,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'Material Medico Hospitalar e Odontológico',
      tipo: 'Material',
      material_estoque: 'Luva G Procedimento',
      qt_consumo: 9.0122,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'Material Medico Hospitalar e Odontológico',
      tipo: 'Material',
      material_estoque: 'Broca M102Ff',
      qt_consumo: 10.811,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'material',
      tipo: 'Material',
      material_estoque: 'Compressa de Gase 25x18',
      qt_consumo: 12.0107,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'material',
      tipo: 'Material',
      material_estoque: 'Compressa de Gase 5x5',
      qt_consumo: 14.0067,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'material',
      tipo: 'Material',
      material_estoque: 'Balão de Oxigênio',
      qt_consumo: 15.9994,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'Material Medico Hospitalar e Odontológico',
      tipo: 'Material',
      material_estoque: 'Broca Diamantada M2903F',
      qt_consumo: 18.9984,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
    {
      grupo: 'material',
      tipo: 'Material',
      material_estoque: 'Catatér 18',
      qt_consumo: 20.1797,
      un_medida: 'un',
      valor_consumo: 'R$ 1.984,25',
    },
  ];

  constructor() {
    this.loadingScreen = true;
  }
  ngOnInit() {
    this.chartBar_One = {
      title: {
        text: 'Ranking: Grupo de Materiais - Valor Consumo',
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
          text: 'Consumo (em reais)',
        },
      },
      legend: {
        enabled: false,
      },

      series: [
        {
          type: 'bar',
          name: 'Consumo (em reais)',
          colors: [
            '#9b20d9',
            '#9215ac',
            '#861ec9',
            '#7a17e6',
            '#7010f9',
            '#691af3',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['O.P.M.E', 489565.79],
            ['Materials Médicos', 162080.81],
            ['Uniformes e Enxoval', 129916.51],
            ['Drogas e Medicamentos', 119819.63],
            ['Gênero Alimentícios', 42204.08],
            ['Outros', 9087.05],
          ],
        },
      ],
    };

    this.chartBar_Two = {
      title: {
        text: 'Top 15: Materiais Consumidos (Valores)',
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
          text: 'Consumo (em reais)',
        },
      },
      legend: {
        enabled: false,
      },

      series: [
        {
          type: 'bar',
          name: 'Consumo (em reais)',
          colors: [
            '#ff0000',
            '#ff1a00',
            '#ff3300',
            '#ff4d00',
            '#ff6600',
            '#ff8000',
            '#ff9900',
            '#ffb200',
            '#ffcc00',
            '#ffe500',
            '#ffff00',
            '#e5ff00',
            '#ccff00',
            '#b2ff00',
            '#99ff00',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Pinça 5mmx', 55720.9],
            ['Avental 50g', 23258.63],
            ['Carga Grampeador', 21239.41],
            ['Kit Cirurgico', 51155.78],
            ['Pinça 6mmx', 17378.4],
            ['Kit Ultrassom', 13885.01],
            ['Kit Gastrectomia', 13100.55],
            ['Valvula Biologica', 12598.05],
            ['Cobertor Microfibras', 12005.3],
            ['Kit Bypass', 11658.86],
            ['Avental 70g', 10593.33],
            ['Luvas Procedimento', 9654.22],
            ['Kit Laparoscopia', 6845.22],
            ['Outros', 96403.22],
          ],
        },
      ],
    };

    this.chartBar_Three = {
      title: {
        text: 'Top 15: Materiais Consumidos (Quantidade)',
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
          text: 'Consumo (em reais)',
        },
      },
      legend: {
        enabled: false,
      },

      series: [
        {
          type: 'bar',
          name: 'Consumo (em reais)',
          colors: [
            '#80ff00',
            '#66ff00',
            '#4dff00',
            '#33ff00',
            '#1aff00',
            '#00ff00',
            '#00ff1a',
            '#00ff33',
            '#00ff4d',
            '#00ff66',
            '#00ff80',
            '#00ff99',
            '#00ffb2',
            '#00ffcc',
            '#00ffe5',
          ],
          colorByPoint: true,
          groupPadding: 0,
          data: [
            ['Copo Descatável 200ml', 39600],
            ['Açúcar Sache ', 6175],
            ['Eletro Adulto ', 4526],
            ['Adesivo Material Esteril ', 4000],
            ['Avental 50g ', 6052],
            ['Luva Vinil G ', 9300],
            ['Pão Francês 50g', 2995],
            ['Embalagens para talher ', 3000],
            ['Tampa para pote 200ml ', 2998],
            ['Luva P Procedimento ', 13404],
            ['Saco de Lixo 40L ', 2700],
            ['Adoçante Sache ', 2650],
            ['Tampa isopor ', 2350],
            ['Oxigênio Liquido ', 2300],
            ['Luva Vinil M ', 8700],
          ],
        },
      ],
    };

    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
