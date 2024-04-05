import { Component } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';

@Component({
  selector: 'app-content-screen',
  standalone: true,
  imports: [SideBarComponent],
  templateUrl: './content-screen.component.html',
  styleUrl: './content-screen.component.css',
})
export class ContentScreenComponent {}
