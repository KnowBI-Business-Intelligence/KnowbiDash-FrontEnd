import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CreateDashsComponent } from '../create-dashs/create-dashs.component';
import { CreatePathsComponent } from '../create-paths/create-paths.component';
import { CreateProfilesComponent } from '../create-profiles/create-profiles.component';

@Component({
  selector: 'app-profiles-folders',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    CreateProfilesComponent,
    CreatePathsComponent,
    CreateDashsComponent,
  ],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.css',
})
export class StructureComponent {}
