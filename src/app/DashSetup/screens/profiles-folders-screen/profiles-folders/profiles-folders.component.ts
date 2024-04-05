import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { TableModule } from 'primeng/table';
import { ChartsService } from '../../../../services/service/charts/charts.service';
import { ProfilesService } from '../../../../services/service/profiles/profiles.service';
import { StorageService } from '../../../../services/service/user/storage.service';

@Component({
  selector: 'app-profiles-folders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TableModule,
    RouterModule,
    MatSelectModule,
  ],
  templateUrl: './profiles-folders.component.html',
  styleUrl: './profiles-folders.component.css',
})
export class ProfilesFoldersComponent {
  @ViewChild('f') f!: NgForm;

  firstFormGroup = this._formBuilder.group({
    profile: ['', Validators.required],
    observationProfile: ['', Validators.required],

    chartPath: ['', Validators.required],
    profileSelected: ['', Validators.required],

    chartGroup: ['', Validators.required],
    chartGroupTable: ['', Validators.required],
    pathSelected: ['', Validators.required],
  });

  inputText: any;
  inputObservation: any;
  inputAdditional: any;

  listProfiles!: any[];
  listPaths!: any[];
  listChartGroups!: any[];

  panelOpenState: boolean = true;

  private headers: any;

  constructor(
    private _formBuilder: FormBuilder,
    private profiles: ProfilesService,
    private charts: ChartsService,
    private token: StorageService
  ) {
    this.getHeaders();
    this.getProfiles();
    this.getChartPath();
    this.getChartGroup();
  }

  // pegar os dados para exibição
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

  private getProfiles() {
    const that = this;

    this.profiles.getProfiles(this.headers).subscribe({
      next(value) {
        that.listProfiles = value;
      },
      error(err) {
        console.error(err);
      },
    });
  }

  private getChartPath() {
    const that = this;

    this.charts.getChartsPath(this.headers).subscribe({
      next(value) {
        that.listPaths = value;
      },
      error(err) {
        console.error(err);
      },
    });
  }

  private getChartGroup() {
    const that = this;

    this.charts.getChartGroup(this.headers).subscribe({
      next(value) {
        that.listChartGroups = value;
      },
      error(err) {
        console.error(err);
      },
    });
  }

  // criação dos dados

  private createProfiles() {
    this.getHeaders();
    const that = this;
    this.profiles
      .createProfiles(this.headers, this.inputText, this.inputObservation)
      .subscribe({
        next() {
          that.getProfiles();
          that.f.reset();
        },
        error(err) {
          console.error(err);
        },
      });
  }

  private createChartPaths() {
    this.getHeaders();
    const that = this;
    this.charts
      .createChartsPath(this.inputText, this.inputObservation.id, this.headers)
      .subscribe({
        next() {
          that.getChartPath();
          that.f.reset();
        },
        error(err) {
          console.error(err);
        },
      });
  }

  private createChartGroups() {
    this.getHeaders();
    const that = this;
    this.charts
      .createChartGroup(
        this.inputText,
        this.inputObservation,
        this.inputAdditional.id,
        this.headers
      )
      .subscribe({
        next() {
          that.getChartGroup();
          that.f.reset();
        },
        error(err) {
          console.error(err);
        },
      });
  }

  createProfile() {
    this.inputText = this.firstFormGroup.get('profile')?.value;
    this.inputObservation =
      this.firstFormGroup.get('observationProfile')?.value;
    this.createProfiles();
  }

  createChartPath() {
    this.inputText = this.firstFormGroup.get('chartPath')?.value;
    this.inputObservation = this.firstFormGroup.get('profileSelected')?.value;
    this.createChartPaths();
  }

  createChartGroup() {
    this.inputText = this.firstFormGroup.get('chartGroup')?.value;
    this.inputObservation = this.firstFormGroup.get('chartGroupTable')?.value;
    this.inputAdditional = this.firstFormGroup.get('pathSelected')?.value;
    this.createChartGroups();
  }
}
