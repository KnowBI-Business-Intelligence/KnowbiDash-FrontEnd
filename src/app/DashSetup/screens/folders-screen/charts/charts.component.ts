import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { StorageService } from '../../../../core/services/user/storage.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
  ],
  providers: [MessageService],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
})
export class ChartsComponent implements OnInit {
  item: any;
  listCharts: any;
  filteredItems: any;
  newChart: boolean = false;

  private headers!: HttpHeaders;

  chartFormGroup = this._formBuilder.group({
    nameChart: ['', Validators.required],
    SQL_Chart: ['', Validators.required],
  });

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private charts: ChartsService,
    private token: StorageService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.item = this.router.getCurrentNavigation()?.extras.state?.['item'];

    this.listCharts = this.item.charts;
    this.filteredItems = this.item.charts;
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

  private createCharts(title: string, sql: string, idChart: string) {
    const that = this;
    this.getHeaders();
    this.charts.createCharts(this.headers, title, sql, idChart).subscribe({
      next() {
        that.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Gráfico cadastrado.',
        });

        that.chartFormGroup.setValue({
          nameChart: '',
          SQL_Chart: '',
        });
      },
      error() {
        that.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Verifique as informações.',
        });
      },
    });
  }

  createChart() {
    const name = this.chartFormGroup.get('nameChart')?.value as string;
    const sql = this.chartFormGroup.get('SQL_Chart')?.value as string;

    this.createCharts(name, sql, this.item.id);
  }

  onInputChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      this.filteredItems = this.listCharts;
      return;
    }

    this.filteredItems = this.listCharts.filter((item: any) =>
      item.title.toLowerCase().includes(searchTerm)
    );
  }

  clear() {
    throw new Error('Method not implemented.');
  }
}
