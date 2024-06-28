import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartLine,
  faChartPie,
  faRectangleList,
  faTableList,
  faFolderTree,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { CardsComponent } from '../cards/cards.component';
import { ViewCreateComponent } from '../view-create/view-create.component';
import { ChartgroupService } from '../../../../core/services/chartgroup/chartgroup.service';
import { ChartComponent } from '../chart/chart.component';
import { TableComponent } from '../table/table.component';
import { DataService } from '../../../../core/services/dashboard/data.service';
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
    ChartComponent,
    TableComponent,
  ],
})
export class DashboardsViewComponent implements OnInit {
  icons = {
    dash: faChartPie,
    chartview: faChartLine,
    cardview: faRectangleList,
    tableview: faTableList,
    folderTree: faFolderTree,
    close: faXmark,
  };

  @ViewChild('viewCreate') viewCreateComponent!: ViewCreateComponent;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  name = 'Angular';
  position!: string;
  groupName: string = '';
  currentView: string = '';

  lsDashboards: HTMLElement | null = null;
  lsContent: HTMLElement | null = null;
  paths: { [key: string]: Group[] } = {};
  pathNames: { [key: string]: string } = {};

  filters: any[] = [];
  chartConfig: any;
  selectedFilters: any = {};
  checkedValues: any = {};
  selectedGroupId: any = null;
  isDashValid: any;
  isLoading: boolean = true;
  isShowStructure: boolean = false;
  isListContent: boolean = false;
  isLoginLoading: boolean = false;
  isCloseDash: boolean = true;

  user = this.storageService.getUser();

  constructor(
    private router: Router,
    private chartsService: ChartsService,
    private storageService: StorageService,
    private elementRef: ElementRef,
    private localStorageService: LocalstorageService,
    private chartGroupService: ChartgroupService,
    private dataService: DataService
  ) {
    this.currentView = 'ViewCreateComponent';
  }

  ngOnInit(): void {
    const groupIdFromLocalStorage =
      this.localStorageService.getDecryptedItem('chartGroupview');
    const simulatedEvent = {
      currentTarget:
        this.elementRef.nativeElement.querySelector('.selected-group'),
    };
    this.chartGroupService.setCurrentView('ViewCreateComponent');
    this.isDashValid = groupIdFromLocalStorage;
    this.clickPress(groupIdFromLocalStorage, simulatedEvent);
    this.loadDataInit();
    this.startDashboarData();
    this.interruptLoadingScreen();
  }

  public startDashboarData() {
    if (this.currentView == 'ViewCreateComponent') {
      this.getCurrentView();
    }
  }

  showStructure() {
    this.isShowStructure = !this.isShowStructure;
    this.lsDashboards =
      this.elementRef.nativeElement.querySelector('#listDashboards');
    this.lsContent =
      this.elementRef.nativeElement.querySelector('#listContent');
    if (this.isShowStructure) {
      this.lsDashboards!.style.width = '0';
      if (this.isListContent == false) {
        this.lsContent!.style.display = 'none';
      }
    } else {
      this.lsDashboards!.style.width = '245px';
      if (this.isListContent == false) {
        this.lsContent!.style.display = 'none';
        setTimeout(() => {
          this.lsContent!.style.display = 'flex';
        }, 340);
      }
    }
    if (this.isDashValid != null) {
      setTimeout(() => {
        this.viewCreateComponent.updateCombinedLayout();
      }, 440);
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
    this.dataService.setData(undefined);
    if (view == 'chart') {
      this.currentView = 'ChartComponent';
      this.chartGroupService.setCurrentView(this.currentView);
    } else if (view == 'card') {
      this.currentView = 'CardsComponent';
      this.chartGroupService.setCurrentView(this.currentView);
    } else if (view == 'table') {
      this.currentView = 'TableComponent';
      this.chartGroupService.setCurrentView(this.currentView);
    } else {
      this.currentView = 'ViewCreateComponent';
      this.isCloseDash = true;
    }
    console.log(this.isCloseDash);
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
      error: (err) => {},
    });
    if (this.isDashValid == null) {
      this.isCloseDash = false;
    }
  }

  getPathsArray() {
    return Object.keys(this.paths);
  }

  processData(data: any) {
    console.log(data.length);
    if (data.length > 0) {
      this.isListContent = true;
      data.forEach((path: any) => {
        this.paths[path.id] = [];
        this.pathNames[path.id] = path.name;
      });
      this.getDashBoards(Object.keys(this.paths));
    } else {
      this.localStorageService.removeItem('chartGroupview');
      this.chartGroupService.clearEncryptedData();
      this.chartGroupService.clearData();
    }
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
      data.chartPath.forEach((path: any) => {
        if (pathData.includes(path.id)) {
          if (!this.paths[path.id]) {
            this.paths[path.id] = [];
          }
          this.paths[path.id].push(data);
        }
      });
    });
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }

  clickPress(group: any, event: any) {
    this.selectedGroupId = group;
    let encryptedData: any;
    if (this.selectedGroupId != null) {
      encryptedData = {
        id: group.id,
        name: group.name,
        workSpaces: group.workSpaces,
      };
      this.isCloseDash = true;
      this.groupName = `Dashboard: ${group.name}`;
      this.chartGroupService.setEncryptedData(encryptedData);
      this.localStorageService.setEncryptedItem(
        'chartGroupview',
        encryptedData
      );
    } else {
      this.groupName = 'Selecione um dashboard';
    }

    const clickedButton = event ? event.currentTarget : null;
    const allButtons =
      this.elementRef.nativeElement.querySelectorAll('.dashboardbtn');
    allButtons.forEach((button: any) => {
      button.style.backgroundColor = '';
    });
    if (clickedButton) {
      clickedButton.style.backgroundColor = '#00000015';
    }
    group = [];
    event = [];
  }

  interruptLoadingScreen() {
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  closeDash() {
    this.localStorageService.removeItem('chartGroupview');
    this.chartGroupService.clearCurrentView();
    console.log(this.chartGroupService);
    this.ngOnInit();
    this.viewCreateComponent.isDashSelected = true;
    this.viewCreateComponent.isDashContent = false;
    this.viewCreateComponent.isDashvoid = false;
    this.isCloseDash = false;
  }
}
