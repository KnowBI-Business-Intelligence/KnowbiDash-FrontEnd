import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClose,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FilterMetadata } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { FormatConversionService } from '../../../../services/convert/format-conversion.service';
import { PayableService } from './data/payable-data';

@Component({
  selector: 'app-accounts-payable',
  standalone: true,
  imports: [
    ChartModule,
    CommonModule,
    TableModule,
    FontAwesomeModule,
    FormsModule,
    SkeletonModule,
    HighchartsChartModule,
  ],
  providers: [PayableService],
  templateUrl: './accounts-payable.component.html',
  styleUrl: './accounts-payable.component.css',
})
export class AccountsPayableComponent implements AfterContentInit {
  @ViewChild('f') f!: NgForm;
  @ViewChild('payables') tabela!: Table;

  Highcharts: typeof Highcharts = Highcharts;
  chartLine_TitleOffGeral!: Highcharts.Options; // Grafico de linhas (titulos a pagar mensal geral e baixados)
  chartPie_Situation!: Highcharts.Options; // gráficos de titulos por situação
  chartPie_Type!: Highcharts.Options; // gráficos de titulos por tipo

  loading: boolean = true;

  icons = {
    filter: faFilterCircleXmark,
    closed: faClose,
  };
  searchValue?: string;

  loadingScreen: boolean;

  constructor(private format: FormatConversionService) {
    this.loadingScreen = true;
  }

  clear(table: Table): void {
    table.clear();
    this.searchValue = '';
  }

  onInputChange(event: any, table: Table): void {
    if (event.target instanceof HTMLInputElement) {
      const inputValue: string = event.target.value;

      if (inputValue.trim() !== '') {
        const customFilter: FilterMetadata = {
          value: inputValue,
          matchMode: 'contains',
        };

        const filters: { [s: string]: FilterMetadata } = {};

        for (const field of table.globalFilterFields!) {
          filters[field] = customFilter;
        }

        table.filterGlobal(inputValue, 'contains');
      } else {
        this.clear(table);
      }
    }
  }

  converCardCurrency(item: any) {
    return this.format.convertCurrency(item);
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.loadingScreen = !this.loadingScreen;
    }, 1000);
  }
}
