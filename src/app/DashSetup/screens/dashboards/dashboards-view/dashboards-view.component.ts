import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartLine,
  faChartPie,
  faRectangleList,
  faTableList,
} from '@fortawesome/free-solid-svg-icons';
import { ChartgroupService } from '../../../../core/services/chartgroup/chartgroup.service';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { CardsComponent } from '../cards/cards.component';
import { ViewCreateComponent } from '../view-create/view-create.component';
interface Group {
  id: string;
  name: string;
}

@Component({
  selector: 'app-dashboards-view',
  standalone: true,
  templateUrl: './dashboards-view.component.html',
  styleUrl: './dashboards-view.component.css',
  imports: [
    MatIconModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ViewCreateComponent,
    CardsComponent,
  ],
})
export class DashboardsViewComponent implements OnInit {
  icons = {
    dash: faChartPie,
    chartview: faChartLine,
    cardview: faRectangleList,
    tableview: faTableList,
  };

  @ViewChild('chartContainer') chartContainer!: ElementRef;
  name = 'Angular';
  position!: string;
  chartConfig: any;
  groupName: string = '';
  currentView: string = '';

  changeBg: HTMLElement | null = null;
  paths: { [key: string]: Group[] } = {};
  pathNames: { [key: string]: string } = {};

  filters: any[] = [];
  selectedFilters: any = {};
  checkedValues: any = {};
  selectedGroupId: any = null;

  isLoginLoading: boolean = false;
  user = this.storageService.getUser();

  constructor(
    private router: Router,
    private chartsService: ChartsService,
    private storageService: StorageService,
    private elementRef: ElementRef,
    private localStorageService: LocalstorageService,
    private chartGroupService: ChartgroupService
  ) {
    this.currentView = 'ViewCreateComponent';
  }

  ngOnInit(): void {
    this.loadDataInit();
    const groupIdFromLocalStorage =
      this.localStorageService.getDecryptedItem('chartGroupview');
    const simulatedEvent = {
      currentTarget:
        this.elementRef.nativeElement.querySelector('.selected-group'),
    };
    this.clickPress(groupIdFromLocalStorage, simulatedEvent);
    this.startDashboarData();
  }

  startDashboarData() {
    if (this.currentView == 'ViewCreateComponent') {
      this.getCurrentView();
    }
  }

  getCurrentView() {
    this.chartGroupService
      .getCurrentView()
      .subscribe((componentName: string) => {
        this.currentView = componentName;
      });
  }

  switchView(view: string) {
    if (view == 'card') {
      this.currentView = 'CardsComponent';
    } else {
      this.currentView = 'ViewCreateComponent';
    }

    console.log(this.currentView);
  }

  loadDataInit() {
    this.filters = [];
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.getChartsPath(headers).subscribe({
      next: (data) => {
        this.processData(data);
      },
    });
  }

  getPathsArray() {
    return Object.keys(this.paths);
  }

  processData(data: any) {
    data.forEach((path: any) => {
      this.paths[path.id] = [];
      this.pathNames[path.id] = path.name;
    });
    this.getDashBoards(Object.keys(this.paths));
  }

  getDashBoards(dataPath: string[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.chartsService.getChartGroup(headers).subscribe({
      next: (data) => {
        this.processDashboardsData(data, dataPath);
      },
    });
  }

  processDashboardsData(groupData: any, pathData: string[]) {
    groupData.forEach((data: any) => {
      if (pathData.includes(data.chartPath.id)) {
        this.paths[data.chartPath.id].push(data);
      }
    });
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }

  clickPress(group: any, event: any) {
    this.selectedGroupId = group;
    const encryptedData = {
      id: group.id,
      name: group.name,
    };
    const clickedButton = event ? event.currentTarget : null;
    const allButtons =
      this.elementRef.nativeElement.querySelectorAll('.dashboardbtn');
    allButtons.forEach((button: any) => {
      button.style.backgroundColor = '';
    });
    if (clickedButton) {
      clickedButton.style.backgroundColor = '#00000015';
    }
    this.groupName = group.name;
    this.chartGroupService.setEncryptedData(encryptedData);
    this.localStorageService.setEncryptedItem('chartGroupview', encryptedData);
  }
}
