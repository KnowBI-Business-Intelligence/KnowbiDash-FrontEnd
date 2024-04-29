import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { FilterMetadata, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { StorageService } from '../../../../core/services/user/storage.service';

@Component({
  selector: 'app-create-folders',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TableModule,
    RouterModule,
    CommonModule,
    MatSelectModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './create-folders.component.html',
  styleUrl: './create-folders.component.css',
})
export class CreateFoldersComponent {
  firstFormGroup = this._formBuilder.group({
    nameGroup: ['', Validators.required],
    folderChart: ['', Validators.required],
    nameTable: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    SQL: ['', Validators.required],
    searchValue: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    nameChart: ['', Validators.required],
    SQL_Chart: ['', Validators.required],
  });

  isLinear = false;
  loading: boolean = true;
  headers!: HttpHeaders;

  codeSQL: string = '';
  tableData!: any;

  folderControl!: any;
  private SQL_code!: any;
  private folderSelected!: any;
  private tableName!: any;
  private chartName!: any;
  private SQL_chart!: any;
  private chartGroupNameID!: any;
  private chartGroupName!: any;

  showTable: boolean = false;
  searchValue: any;

  constructor(
    private _formBuilder: FormBuilder,
    private charts: ChartsService,
    private token: StorageService,
    private messageService: MessageService
  ) {
    this.getPath();
    this.searchValue = this.secondFormGroup.get('searchValue')?.value;
  }

  private getPath() {
    this.getHeaders();
    const that = this;

    this.charts.getChartsPath(this.headers).subscribe({
      next(value: any) {
        that.folderControl = value;
      },
      error(err: Error) {
        console.error(err);
      },
    });
  }

  private getHeaders() {
    const user = this.token.getUser();

    if (!user || !user.token) {
      console.error('Token não disponível');
      return;
    }

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
  }

  private updateSQLChartGroup() {
    this.getHeaders();
    this.charts
      .updateChartGroupSQL(this.headers, this.chartGroupNameID, this.SQL_code)
      .subscribe({
        next(value: any) {
          console.log('value', value);
        },
        error(err: Error) {
          console.error(err);
        },
      });
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  private createChartGroup() {
    const that = this;
    this.getHeaders();

    this.charts
      .createChartGroup(
        this.headers,
        this.chartGroupName,
        this.tableName,
        this.folderSelected.id
      )
      .subscribe({
        next(value: any) {
          that.chartGroupNameID = value?.id;
        },
        error(err: Error) {
          console.error(err);
        },
      });
  }

  private createCharts(name: string, sql: string) {
    const that = this;
    this.getHeaders();

    this.charts
      .createCharts(this.headers, name, sql, this.chartGroupNameID)
      .subscribe({
        next(value: any) {
          that.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Gráfico cadastrado. ',
          });
          that.thirdFormGroup.setValue({
            nameChart: '',
            SQL_Chart: '',
          });
        },
        error(err: Error) {
          console.error(err);
        },
      });
  }

  createChart() {
    this.chartName = this.thirdFormGroup.get('nameChart')?.value;
    this.SQL_chart = this.thirdFormGroup.get('SQL_Chart')?.value;

    this.createCharts(this.chartName, this.SQL_chart);
  }

  getItemFolder() {
    this.chartGroupName = this.firstFormGroup.get('nameGroup')?.value;
    this.tableName = this.firstFormGroup.get('nameTable')?.value;
    this.folderSelected = this.firstFormGroup.get('folderChart')?.value;

    this.createChartGroup();
  }

  runnerSQL() {
    this.SQL_code = this.secondFormGroup.get('SQL')?.value;

    this.updateSQLChartGroup();
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
}
