import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { Chart, ChartModule } from 'angular-highcharts';

@Component({
  selector: 'app-sqlrunner-update',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ChartModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './sqlrunner-update.component.html',
  styleUrl: './sqlrunner-update.component.css',
})
export class SQLRunnerUpdateComponent implements OnInit {
  private typeChart!: any;
  private item: any;
  private jsonResult: any;

  chart!: Chart;
  panelOpenState: boolean = true;

  titleFormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    align: ['', Validators.required],
    color: ['', Validators.required],
    fontSize: ['', Validators.required],
  });

  subtitleFormGroup = this._formBuilder.group({
    subtitle: ['', Validators.required],
    color: ['', Validators.required],
    fontSize: ['', Validators.required],
  });

  xAxis = this._formBuilder.group({
    xAxis_legend: ['', Validators.required],
  });

  YAxis = this._formBuilder.group({
    YAxis_legend: ['', Validators.required],
  });

  seriesFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    serie_one: ['', Validators.required],
    serie_two: ['', Validators.required],
  });

  constructor(private router: Router, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.chart = new Chart({});
    this.item = this.router.getCurrentNavigation()?.extras.state?.['item'];
    this.jsonResult = this.item.jsonResult;
  }

  setValue(value: string) {
    this.typeChart = value;
  }

  update() {
    this.chart = new Chart({
      title: {
        text: this.titleFormGroup.get('title')?.value as string,
        align: this.titleFormGroup.get('align')?.value as any,
        style: {
          color: this.titleFormGroup.get('color')?.value as string,
          fontSize: this.titleFormGroup.get('fontSize')?.value as string,
        },
      },
      subtitle: {
        text: this.subtitleFormGroup.get('subtitle')?.value as string,
        style: {
          color: this.subtitleFormGroup.get('color')?.value as string,
          fontSize: this.subtitleFormGroup.get('fontSize')?.value as string,
        },
      },
      accessibility: { description: 'Gráfico' },

      // xAxis: {
      //   labels: {},
      //   title: {
      //     text: '',
      //   },
      // },

      // yAxis: {
      //   labels: {},
      //   title: {
      //     text: '',
      //   },
      // },

      //
      series: [
        {
          type: this.typeChart,
          data: [
            ['conv, asda, asd', 4],
            ['x', 6],
            ['z', 4],
          ],
          name: this.subtitleFormGroup.get('fontSize')?.value as string,
        },
      ],
    });
  }
}
