import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToolBarMenuComponent } from '../../components/tool-bar-menu/tool-bar-menu.component';

interface SideNavTogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admcontent-screen',
  standalone: true,
  imports: [ToolBarMenuComponent, CommonModule],
  templateUrl: './admcontent-screen.component.html',
  styleUrl: './admcontent-screen.component.css',
})
export class ADMContentScreenComponent {
  isSideNAvCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavTogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNAvCollapsed = data.collapsed;
  }
}
