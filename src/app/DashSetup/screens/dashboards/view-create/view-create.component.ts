import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HighchartsChartModule } from 'highcharts-angular';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription, debounceTime, filter, fromEvent, merge } from 'rxjs';
import Highcharts from 'highcharts';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { StorageService } from '../../../../core/services/user/storage.service';
import { ChartgroupService } from '../../../../core/services/chartgroup/chartgroup.service';
import { TableModule } from 'primeng/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LayoutService } from './layoutservice';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import 'moment/locale/pt-br';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatDivider } from '@angular/material/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataService } from '../../../../core/services/dashboard/data.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import {
  NgxSliderModule,
  Options,
  LabelType,
} from '@angular-slider/ngx-slider';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  CardData,
  ChartData,
  Group,
  TableRow,
} from '../../../../core/modules/interfaces';
import {
  faRotateLeft,
  faFloppyDisk,
  faFilter,
  faBars,
  faPenToSquare,
  faTrash,
  faExpand,
  faArrowTrendUp,
} from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  KtdDragEnd,
  KtdDragStart,
  KtdGridComponent,
  KtdGridLayout,
  KtdGridModule,
  KtdResizeEnd,
  KtdResizeStart,
  ktdTrackById,
} from '@katoid/angular-grid-layout';
import {
  CustomDateAdapter,
  MY_FORMATS,
  generateLayout2,
  ktdArrayRemoveItem,
} from './utils';

registerLocaleData(localePt);

@Component({
  selector: 'app-view-create',
  standalone: true,
  imports: [
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatDivider,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    NgxSliderModule,
    FontAwesomeModule,
    CommonModule,
    SkeletonModule,
    ProgressSpinnerModule,
    HighchartsChartModule,
    FormsModule,
    TableModule,
    KtdGridModule,
    ToastModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
  templateUrl: './view-create.component.html',
  styleUrls: [
    './view-create.component.scss',
    './view-create.component.css',
    '../../../../core/globalStyle/toast.css',
  ],
})
export class ViewCreateComponent implements OnInit, OnDestroy {
  @ViewChildren(CdkMenuTrigger) menuTriggers!: QueryList<CdkMenuTrigger>;
  @ViewChild(KtdGridComponent, { static: true }) grid!: KtdGridComponent;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('fullScreenDiv') fullScreenDiv!: ElementRef;
  private encryptedDataSubscription: Subscription | undefined;

  icons = {
    back: faRotateLeft,
    save: faFloppyDisk,
    filter: faFilter,
    menu: faBars,
    edit: faPenToSquare,
    delete: faTrash,
    fullScreen: faExpand,
    arrowTrend: faArrowTrendUp,
  };

  cols: number = 50;
  rowHeight: number = 79;
  compactType: 'vertical' | 'horizontal' | null = 'horizontal';
  layout: KtdGridLayout = generateLayout2(this.cols, 3);
  saveNewLayoutUpdated: KtdGridLayout = [];
  dragStartThreshold = 0;
  autoScroll = true;
  disableDrag = false;
  disableResize = false;
  disableRemove = false;
  autoResize = true;
  preventCollision = false;
  isDragging = false;
  isResizing = false;
  resizeSubscription!: Subscription;

  name = 'Angular';
  position!: string;
  tableTitle: string = '';

  isEditingIndex: number | null = null;

  private layoutId: any;
  private itemId: any;
  private itemtype: any;
  chartConfig: { [key: string]: Highcharts.Options } = {};
  charts: { [key: string]: Highcharts.Chart } = {};
  currentView: any;
  groupInfo: any;

  changeBg: HTMLElement | null = null;
  filterModal: HTMLElement | null = null;
  buttonMenuItem: HTMLElement | null = null;
  gridContainer: HTMLElement | null = null;
  paths: { [key: string]: Group[] } = {};
  pathNames: { [key: string]: string } = {};

  Highcharts: typeof Highcharts = Highcharts;

  displayedColumns: string[] = [];
  displayedRows: TableRow[] = [];
  chartGroupsData: any[] = [];
  cardGroupsData: CardData[] = [];
  tableGroupsData: any[] = [];
  workspaceGroup: any[] = [];
  filters: any[] = [];
  cardFilters: any[] = [];
  tableFilters: any[] = [];
  chartFilters: any[] = [];
  selectedFilters: any = {};
  checkedValues: any = {};
  copydataJSON: any[] = [];
  copyDataTableJSON: any[] = [];
  copyDataCardJSON: any[] = [];
  selectedGroupId: any = null;
  originalChartData: ChartData[] = [];
  chartData: ChartData[] = [];
  cardsData: any[] = [];
  tableData: any[] = [];
  showTableColumns: any[] = [];
  showTableData: any[] = [];
  originalLayout: any[] = [];
  showModal: boolean = false;
  isShowFilterModal: boolean = false;
  isLoading: boolean = true;
  isFullScreen: boolean = false;
  isDashContent: boolean = false;
  isDashSelected: boolean = false;
  isDashvoid: boolean = false;
  isSaving: boolean = false;
  isDonut: boolean = false;
  showContentFilterSwitch: boolean[] = [];

  minValue: number = 100;
  maxValue: number = 400;
  values: number[] = [];
  numberFilterValues: any[] = [];
  options!: Options;

  user = this.storageService.getUser();
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.user.token}`,
  });

  trackById = ktdTrackById;
  transitions: { name: string; value: string }[] = [
    {
      name: 'ease',
      value: 'transform 500ms ease, width 500ms ease, height 500ms ease',
    },
    { name: 'transform-only', value: 'transform 500ms ease' },
  ];
  currentTransition: string = this.transitions[0].value;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private chartsService: ChartsService,
    private storageService: StorageService,
    private chartGroupService: ChartgroupService,
    public elementRef: ElementRef,
    private layoutService: LayoutService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private dataService: DataService,
    private dateAdapter: DateAdapter<Date>,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.dateAdapter.setLocale('pt-BR');
    this.currentView = null;
  }

  ngOnInit(): void {
    this.startDashboarData();
    this.showFullScreen();
    this.filters.forEach((index) => {
      this.showContentFilterSwitch[index] = false;
    });
    this.resizeSubscription = merge(
      fromEvent(window, 'resize'),
      fromEvent(window, 'orientationchange')
    )
      .pipe(
        debounceTime(50),
        filter(() => this.autoResize)
      )
      .subscribe(() => {
        this.grid.resize();
      });
  }

  ngOnDestroy() {
    this.hiddenFullscreen();
    this.resizeSubscription.unsubscribe();
    if (this.encryptedDataSubscription) {
      this.encryptedDataSubscription.unsubscribe();
    }
  }

  startDashboarData() {
    this.encryptedDataSubscription =
      this.chartGroupService.encryptedData$.subscribe((encryptedData) => {
        if (encryptedData != null) {
          this.isLoading = true;
          this.isDashContent = true;
          this.isDashSelected = false;
          this.groupInfo = encryptedData;
          this.getCharts(encryptedData.id);
          this.getCards(encryptedData.id);
          this.getTables(encryptedData.id);
        } else {
          this.isDashSelected = true;
          this.isDashContent = false;
        }
      });
  }

  getCharts(id: string): void {
    this.chartsService.getCharts(this.headers).subscribe({
      next: (data) => {
        this.originalChartData = data;
        this.loadData(data, id);
      },
    });
  }

  getCards(id: string): void {
    this.chartsService.getCards(this.headers).subscribe({
      next: (data) => {
        this.loadCards(data, id);
      },
    });
  }

  getTables(id: string): void {
    this.chartsService.getTables(this.headers).subscribe({
      next: (data) => {
        this.loadTables(data, id);
      },
    });
  }

  loadCards(cardData: any, groupId: any) {
    this.copyDataCardJSON = [];
    this.filters = [];
    this.cardGroupsData = [];
    cardData.forEach((card: any) => {
      if (card.chartGroup.id == groupId) {
        this.copyDataCardJSON.push(card);
        this.cardFilters.push(card.filters);
      }
    });

    cardData.forEach((card: any) => {
      if (card.chartGroup.id === groupId) {
        let result = null;
        if (typeof card.result === 'number') {
          result = this.formatterResultWhenDecimal(card.result);
        } else {
          result = card.result;
        }
        let cardTitle = card.title;
        let cardResult = card.prefix + '' + result + ' ' + card.sufix;

        let finalData = {
          id: card.id,
          title: cardTitle,
          type: 'card',
          content: cardResult,
          workspace: card.workspace,
          chartgroup: card.chartGroup,
          filters: card.filters,
        };
        this.cardGroupsData.push(finalData);
      }
    });

    this.updateCombinedLayout();
  }

  loadTables(tableData: any, groupId: any) {
    this.copyDataTableJSON = [];
    this.filters = [];
    this.tableGroupsData = [];
    tableData.forEach((table: any) => {
      this.copyDataTableJSON.push(table);
      this.tableFilters.push(table.filters);
    });

    tableData.forEach((table: any) => {
      if (table.chartGroup.id === groupId) {
        this.copyDataTableJSON.push(table);
        const tableGroup: any = {
          id: table.id,
          type: 'table',
          title: table.title,
          showTableColumns: [],
          showTableData: [],
          chartgroup: table.chartGroup,
          workspace: table.workspace,
          filters: table.filters,
        };

        tableGroup.showTableColumns = table.tableData.map((td: any) => ({
          field: td.column[0],
          header: td.th[0],
        }));

        const rowCount = table.tableData[0].td.length;

        for (let i = 0; i < rowCount; i++) {
          const row: any = {};
          table.tableData.forEach((td: any) => {
            row[td.column[0]] = td.td[i];
          });
          tableGroup.showTableData.push(row);
        }

        this.tableGroupsData.push(tableGroup);
      }
    });

    this.updateCombinedLayout();
  }

  loadData(chartData: ChartData[], groupId: any) {
    this.copydataJSON = [];
    this.filters = [];
    this.chartGroupsData = [];

    chartData.forEach((chart: any) => {
      this.copydataJSON.push(chart);
      this.chartFilters.push(chart.filters);
    });

    chartData.forEach((data: any) => {
      if (data.chartGroup.id === groupId) {
        this.copydataJSON.push(data);
        this.updateChartData(data);
      }
    });
    this.updateCombinedLayout();
  }

  updateChartData(data: any) {
    console.log(data);
    const categories: string[] =
      data.xAxisColumns.length > 0
        ? Array.from(new Set(data.xAxisColumns[0].data))
        : [];
    const yAxisData: number[] = data.yAxisColumns[0].data;

    let highchartsSeries: Highcharts.SeriesColumnOptions[] = [];

    if (data.series.length === 0) {
      highchartsSeries = [
        {
          type: data.graphType,
          name: 'Dados',
          data: yAxisData,
        },
      ];
    } else {
      const seriesCategories: string[] = data.series[0].data;
      const seriesData: { [key: string]: { [category: string]: number } } = {};

      for (let i = 0; i < seriesCategories.length; i++) {
        const seriesCategory = seriesCategories[i];
        const category =
          data.xAxisColumns.length > 0 ? data.xAxisColumns[0].data[i] : [];
        const value = yAxisData[i];

        if (!seriesData[seriesCategory]) {
          seriesData[seriesCategory] = {};
        }
        if (!seriesData[seriesCategory][category]) {
          seriesData[seriesCategory][category] = 0;
        }
        seriesData[seriesCategory][category] += value;
      }

      if (data.graphType == 'donut') {
        console.log(true);
        data.graphType = 'pie';
        this.isDonut = true;
      } else {
        this.isDonut = false;
      }

      if (data.graphType === 'pie') {
        const pieData = data.yAxisColumns[0].data.map(
          (y: number, index: number) => ({
            name: data.series[0].data[index],
            y: y,
          })
        );
        highchartsSeries.push({
          type: data.graphType,
          name: data.series[0].name[0],
          colorByPoint: true,
          data: pieData,
        });
      } else {
        for (const seriesCategory in seriesData) {
          if (seriesData.hasOwnProperty(seriesCategory)) {
            const dataset: number[] = categories.map(
              (category) => seriesData[seriesCategory][category] || 0
            );
            highchartsSeries.push({
              type: data.graphType,
              name: seriesCategory,
              data: dataset,
            });
          }
        }
      }
    }

    if (!this.charts) {
      this.charts = {};
    }

    const chartOptions: Highcharts.Options = {
      chart: {
        type: data.graphType,
      },
      title: {
        text: data.title,
        align: 'center',
        style: {
          fontSize: '13px',
          fontWeight: '450',
        },
      },
      xAxis:
        data.graphType === 'pie'
          ? undefined
          : {
              categories: categories,
              crosshair: true,
              accessibility: {
                description: 'Categories',
              },
              title: {
                text: data.xAxisColumns[0].name[0],
                style: {
                  fontSize: '11px',
                },
              },
              labels: {
                style: {
                  fontSize: '10px',
                },
              },
            },
      yAxis:
        data.graphType === 'pie'
          ? undefined
          : {
              min: 0,
              title: {
                text: data.yAxisColumns[0].name[0],
                style: {
                  fontSize: '11px',
                },
              },
              labels: {
                style: {
                  fontSize: '10px',
                },
              },
            },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '10px',
              fontWeight: '400',
            },
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '10px',
              fontWeight: '400',
            },
          },
          groupPadding: 0.1,
        },
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: this.isDonut ? '50%' : '0%',
          showInLegend: true,
          borderRadius: 5,
          dataLabels: {
            enabled: true,
            format: '<b">{point.name}</b><br>{point.percentage:.1f} %',
            style: {
              fontSize: '12px',
              fontWeight: '400',
            },
          },
        },
        area: {
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '10px',
              fontWeight: '400',
            },
          },
        },
        line: {
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '10px',
              fontWeight: '400',
            },
          },
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                //console.log('Coluna clicada:', this.category, this.y);
              },
            },
          },
        },
      },
      series: highchartsSeries,
      legend: {
        maxHeight: 65,
        itemStyle: {
          fontSize: '10px',
        },
      },
    };

    if (this.charts[data.id]) {
      const chart = this.charts[data.id];
      while (chart.series.length > 0) {
        chart.series[0].remove(false);
      }
      highchartsSeries.forEach((series) => {
        chart.addSeries(series, false);
      });
      chart.xAxis[0].setCategories(categories, false);
      chart.update(chartOptions, false);
      chart.redraw();
    } else {
      this.chartConfig[data.id] = chartOptions;
    }

    const chartDataFinal = {
      id: data.id,
      data: this.chartConfig[data.id],
      type: 'chart',
      chartgroup: data.chartGroup,
      workspace: data.workspace,
      filters: data.filters,
    };

    this.chartGroupsData.push(chartDataFinal);
  }

  public updateCombinedLayout() {
    const combinedData = [
      ...this.cardGroupsData,
      ...this.tableGroupsData,
      ...this.chartGroupsData,
    ];
    if (combinedData.length == 0 || combinedData == null) {
      this.isDashvoid = true;
      this.isDashContent = false;
    } else {
      this.isDashContent = true;
      this.isDashvoid = false;
    }
    this.updateLayout(combinedData);
    this.initFilters(this.groupInfo.id, combinedData);
  }

  updateLayout(data: any) {
    this.layout = [];
    this.layout = [
      ...data.map((item: any) => {
        if (item.type == 'card') {
          return {
            id: item.workspace.id,
            itemId: item.id,
            type: item.workspace.type,
            title: item.title,
            content: item.content,
            x: item.workspace.x,
            y: item.workspace.y,
            w: item.workspace.w,
            h: item.workspace.h,
            ...item.workspace,
          };
        } else if (item.type == 'table') {
          return {
            id: item.workspace.id,
            itemId: item.id,
            type: item.workspace.type,
            title: item.title,
            showTableColumns: item.showTableColumns,
            showTableData: item.showTableData,
            x: item.workspace.x,
            y: item.workspace.y,
            w: item.workspace.w,
            h: item.workspace.h,
            ...item.workspace,
          };
        } else if (item.type == 'chart') {
          return {
            id: item.workspace.id,
            itemId: item.id,
            type: item.workspace.type,
            data: item.data,
            x: item.workspace.x,
            y: item.workspace.y,
            w: item.workspace.w,
            h: item.workspace.h,
            ...item.workspace,
          };
        }
      }),
    ];
    setTimeout(() => {
      this.isLoading = false;
      this.isSaving = false;
    }, 1000);
    this.originalLayout = JSON.parse(JSON.stringify(this.layout));
    this.saveNewLayoutUpdated = this.layout;
  }

  onLayoutUpdated(layout: KtdGridLayout) {
    this.saveNewLayoutUpdated = [];
    this.layout = layout.map((updatedItem: any) => {
      const originalItem = this.originalLayout.find(
        (item) => item.id === updatedItem.id
      );
      return {
        ...originalItem,
        ...updatedItem,
      };
    });
    this.saveNewLayoutUpdated = this.layout;
  }

  saveLayoutUpdated() {
    this.saveNewLayoutUpdated.map((data: any) => {
      const requestUpdateData = {
        identifier: data.identifier,
        type: data.type,
        x: data.x,
        y: data.y,
        w: data.w,
        h: data.h,
      };
      this.chartsService
        .updateWorkspace(this.headers, requestUpdateData, data.id)
        .subscribe({
          next: (value) => {
            console.log;
            setTimeout(() => {
              this.startDashboarData();
            }, 440);
          },
        });
    });
    this.isSaving = true;
  }

  updateFilterLabel(index: number): void {
    this.isEditingIndex = index;
  }

  saveFilterLabel(): void {
    if (this.isEditingIndex !== null) {
      const updatedIdentifiers =
        this.filters[this.isEditingIndex].identifiers.flat(Infinity);
      this.filters[this.isEditingIndex].identifiers = updatedIdentifiers;
      this.isEditingIndex = null;
      this.executeFilter();
    }
  }

  addFilters(filters: any[]) {
    this.selectedFilters = [];
    if (!filters) {
      return;
    }

    filters.forEach((filter: any) => {
      if (filter) {
        const column = filter.column[0];
        const existingFilter = this.filters.find((f) => f.column === column);
        if (existingFilter) {
          existingFilter.values = Array.from(
            new Set([...(existingFilter.values || []), ...(filter.value || [])])
          );

          existingFilter.allfilters = Array.from(
            new Set([
              ...(existingFilter.allfilters || []),
              ...(filter.allfilters || []),
            ])
          );

          existingFilter.operator = filter.operator;
          if (filter.identifiers !== undefined) {
            existingFilter.identifiers = [filter.identifiers];
          }
        } else {
          const identifiers =
            filter.identifiers !== undefined ? [filter.identifiers] : [];
          this.filters.push({
            column: filter.column[0],
            values: filter.value || [],
            identifiers: identifiers,
            allfilters: filter.allfilters || [],
            operator: filter.operator || [],
            type: filter.type || [],
          });
        }
        if (filter.type == 'numeric') {
          this.minValue = filter.allfilters[0];
          this.maxValue = filter.allfilters[1];
          this.options = {
            floor: 0,
            ceil: filter.allfilters[1],
            translate: (value: number, label: LabelType): string => {
              switch (label) {
                case LabelType.Low:
                  this.values[0] = value;
                  return '<b>Min:</b> ' + value;
                case LabelType.High:
                  this.values[1] = value;
                  return '<b>Max:</b> ' + value;
                default:
                  return '' + value;
              }
            },
          };
          this.numberFilterValues = [filter.column, this.values, filter.type];
        }
      }
    });
  }

  initFilters(groupInfo: any, combinedData: any) {
    combinedData.map((data: any) => {
      if (groupInfo == data.chartgroup.id) {
        this.addFilters(data.filters);
      }
    });
  }

  openModal(): void {
    this.showFilters();
    let filterValuesByColumn: { [key: string]: string[] } = {};
    this.filters.forEach((filter: any) => {
      this.checkedValues[filter.column] = filter.values;
      this.allfilters(filter.values, filter.column);
      if (!(filter.column[0] in filterValuesByColumn)) {
        filterValuesByColumn[filter.column[0]] = [];
      }
      if (filter.value) {
        filter.value.forEach((value: string) => {
          if (!filterValuesByColumn[filter.column[0]].includes(value)) {
            filterValuesByColumn[filter.column[0]].push(value);
          }
        });
      }
    });

    this.filters.forEach((filter: any) => {
      filter.values = filterValuesByColumn[filter.column];
    });
  }

  showFilters() {
    this.isShowFilterModal = !this.isShowFilterModal;
    this.filterModal = this.elementRef.nativeElement.querySelector('#modal');
    this.gridContainer =
      this.elementRef.nativeElement.querySelector('.grid-container');
    if (this.isShowFilterModal) {
      this.filterModal!.style.width = '330px';
      this.gridContainer!.style.overflowX = 'hidden';
    } else {
      this.filterModal!.style.width = '0';
    }
    setTimeout(() => {
      this.updateCombinedLayout();
    }, 440);
  }

  allfilters(values: string[], column: string) {
    this.selectedFilters[column] = values;
  }

  showContentFilter(index: number) {
    this.showContentFilterSwitch[index] = !this.showContentFilterSwitch[index];
  }

  onCheckboxChange(column: string, value: string) {
    if (!this.checkedValues[column]) {
      this.checkedValues[column] = [];
    }

    const index = this.checkedValues[column].indexOf(value);
    if (index === -1) {
      this.checkedValues[column].push(value);
    } else {
      this.checkedValues[column].splice(index, 1);
    }

    this.updateDropdownLabel(column);
  }

  isChecked(values: string[], allfilters: string): boolean {
    if (values.includes(allfilters)) {
      return true;
    } else {
      return false;
    }
  }

  updateDropdownLabel(column: string) {
    const selectedValues = this.checkedValues[column];
    if (selectedValues && selectedValues.length > 0) {
      this.selectedFilters[column] = selectedValues.join(', ');
    } else {
      this.selectedFilters[column] = 'Todos';
    }
  }

  updateDate(
    dateType: 'startDate' | 'endDate',
    filter: any,
    selectedDate: Date
  ) {
    filter[dateType] = selectedDate;
    this.updateDropdownLabel(filter.column);
    this.printDates(filter);
  }

  printDates(filter: any) {
    const startDate = this.datePipe.transform(filter.startDate, 'dd/MM/yyyy');
    const endDate = this.datePipe.transform(filter.endDate, 'dd/MM/yyyy');
    const dateUpdate = `${startDate}` + `, ` + `${endDate}`;
    this.selectedFilters[filter.column] = dateUpdate;
  }

  executeFilter() {
    const flattenIdentifiers = (identifiers: any[]) =>
      identifiers.flat(Infinity);

    const filteredChartData = JSON.parse(JSON.stringify(this.copydataJSON));
    const filteredTableData = JSON.parse(
      JSON.stringify(this.copyDataTableJSON)
    );
    const filteredCardData = JSON.parse(JSON.stringify(this.copyDataCardJSON));

    let processChartData: any[] = [];
    let processTableData: any[] = [];
    let processCardData: any[] = [];

    for (const chartGroup of filteredChartData) {
      if (chartGroup.filters && chartGroup.chartGroup.id == this.groupInfo.id) {
        for (const filter of chartGroup.filters) {
          this.filters.map((data) => {
            if (
              this.numberFilterValues[0] == data.column &&
              filter.type == 'numeric'
            ) {
              filter.value = this.numberFilterValues[1];
            }
            if (filter.column == data.column) {
              filter.identifiers[0] = flattenIdentifiers(data.identifiers);
            }
          });
          if (filter.type == 'timestamp') {
            let selectedValue = this.selectedFilters[filter.column[0]];
            if (selectedValue == undefined) {
              filter.value = filter.value;
            } else {
              filter.value = selectedValue.split(', ');
            }
          }
          if (filter.type == 'character') {
            let selectedValue;
            selectedValue = this.checkedValues[filter.column[0]];
            if (selectedValue == undefined || selectedValue == '') {
              selectedValue = 'Todos';
              filter.value = [];
            } else if (Array.isArray(selectedValue)) {
              selectedValue = selectedValue.join(', ');
              filter.value = selectedValue
                .split(', ')
                .map((value) => value.trim());
            } else {
              filter.value = selectedValue
                .split(', ')
                .map((value: string) => value.trim());
            }
          }
        }
        processChartData.push(chartGroup);
      }
    }

    for (const tableGroup of filteredTableData) {
      if (tableGroup.filters) {
        for (const filter of tableGroup.filters) {
          this.filters.map((data) => {
            if (
              this.numberFilterValues[0] == data.column &&
              filter.type == 'numeric'
            ) {
              filter.value = this.numberFilterValues[1];
            }
            if (filter.column == data.column) {
              filter.identifiers[0] = flattenIdentifiers(data.identifiers);
            }
          });

          if (filter.type == 'timestamp') {
            let selectedValue = this.selectedFilters[filter.column[0]];
            if (selectedValue == undefined) {
              filter.value = filter.value;
            } else {
              filter.value = selectedValue.split(', ');
            }
          }

          if (filter.type == 'character') {
            let selectedValue;
            selectedValue = this.checkedValues[filter.column[0]];
            if (selectedValue == undefined || selectedValue == '') {
              selectedValue = 'Todos';
              filter.value = [];
            } else if (Array.isArray(selectedValue)) {
              selectedValue = selectedValue.join(', ');
              filter.value = selectedValue
                .split(', ')
                .map((value) => value.trim());
            } else {
              filter.value = selectedValue
                .split(', ')
                .map((value: string) => value.trim());
            }
          }
          processTableData.push(tableGroup);
        }
      }
    }

    for (const cardGroup of filteredCardData) {
      if (cardGroup.filters && cardGroup.chartGroup.id == this.groupInfo.id) {
        for (const filter of cardGroup.filters) {
          this.filters.map((data) => {
            if (
              this.numberFilterValues[0] == data.column &&
              filter.type == 'numeric'
            ) {
              filter.value = this.numberFilterValues[1];
            }
            if (filter.column == data.column) {
              filter.identifiers[0] = flattenIdentifiers(data.identifiers);
            }
          });

          if (filter.type == 'timestamp') {
            let selectedValue = this.selectedFilters[filter.column[0]];
            if (selectedValue == undefined) {
              filter.value = filter.value;
            } else {
              filter.value = selectedValue.split(', ');
            }
          }

          if (filter.type == 'character') {
            let selectedValue;
            selectedValue = this.checkedValues[filter.column[0]];
            if (selectedValue == undefined || selectedValue == '') {
              selectedValue = 'Todos';
              filter.value = [];
            } else if (Array.isArray(selectedValue)) {
              selectedValue = selectedValue.join(', ');
              filter.value = selectedValue
                .split(', ')
                .map((value) => value.trim());
            } else {
              filter.value = selectedValue
                .split(', ')
                .map((value: string) => value.trim());
            }
          }
        }
        processCardData.push(cardGroup);
      }
    }
    this.updateChartGroupsData(processChartData);
    this.updateTableGroupsData(processTableData);
    this.updateCardGroupsData(processCardData);
  }

  executeFilterProcess(data: any, type: string) {}

  updateChartGroupsData(filteredChartData: any[]) {
    filteredChartData.forEach((data: any) => {
      if (this.groupInfo.id == data.chartGroup.id) {
        data.xAxisColumns.forEach((dat: any) => {
          dat.data = [];
        });
        this.updateChart(
          data.id,
          data.sql,
          data.xAxisColumns,
          data.yAxisColumns,
          data.series,
          data.filters,
          data.group,
          data.order
        );
      }
    });
  }

  updateTableGroupsData(filteredTableGroupsData: any) {
    filteredTableGroupsData.forEach((data: any) => {
      if (this.groupInfo.id == data.chartGroup.id) {
        this.updateTables(data.id, data.tableData, data.filters);
      }
    });
  }

  updateCardGroupsData(cardGroupsData: any) {
    cardGroupsData.forEach((data: any) => {
      if (this.groupInfo.id == data.chartGroup.id) {
        this.updateCards(data.id, data.sql, data.filters);
      }
    });
  }

  updateChart(
    id: string,
    sql: string,
    xAxisColumns: any[],
    yAxisColumns: any[],
    series: any[],
    filters: any[],
    group: string[],
    order: string[]
  ) {
    const formattedXAxisColumns = xAxisColumns.map((column) => ({
      name: column.column,
      identifiers: column.name,
      type: column.type,
      agregator: column.agregator,
    }));

    const formattedYAxisColumns = yAxisColumns.map((column) => ({
      name: column.column,
      identifiers: column.name,
      type: column.type,
      agregator: column.agregator,
    }));

    const formattedSeries = series.map((column) => ({
      name: column.column,
      identifiers: column.name,
      type: column.type,
      agregator: column.agregator,
    }));

    const formattedFilters = filters.map((filter) => ({
      column: filter.column,
      operator: filter.operator,
      value: filter.value,
      identifiers: filter.identifiers,
    }));

    const requestData = {
      sql: sql,
      xAxisColumns: formattedXAxisColumns,
      yAxisColumns: formattedYAxisColumns,
      series: formattedSeries,
      filters: formattedFilters,
      group: group,
      order: order,
    };

    this.chartsService.updateCharts(this.headers, requestData, id).subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.getCharts(data.chartGroup.id);
        }, 800);
      },
      error: (error: any) => {},
    });
  }

  updateTables(id: string, tableData: any[], filters: any[]) {
    const formattedTableData = tableData.map((column) => ({
      name: column.column,
      identifiers: column.th,
      agregator: column.agregator,
      type: column.type,
    }));

    const formattedFilters = filters.map((filter) => ({
      column: filter.column,
      operator: filter.operator,
      value: filter.value,
      identifiers: filter.identifiers,
    }));

    const requestData = {
      tableData: formattedTableData,
      filters: formattedFilters,
    };

    this.chartsService.updateTables(this.headers, requestData, id).subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.getTables(data.chartGroup.id);
        }, 500);
      },
      error: (err: any) => {},
    });
  }

  updateCards(id: string, sql: string, filters: any) {
    const formattedFilters = filters.map((filter: any) => ({
      column: filter.column,
      operator: filter.operator,
      value: filter.value,
      identifiers: filter.identifiers,
    }));

    const requestData = {
      sql: sql,
      filters: formattedFilters,
    };
    this.chartsService.updateCards(this.headers, requestData, id).subscribe({
      next: (data: any) => {
        this.getCards(data.chartGroup.id);
      },
      error(err) {},
    });
  }

  openModalEdit(layoutId: any, itemId: any, type: any) {
    this.dataService.setData(itemId);
    switch (type) {
      case 'chart':
        this.chartGroupService.setCurrentView('ChartComponent');
        break;
      case 'table':
        this.chartGroupService.setCurrentView('TableComponent');
        break;
      case 'card':
        this.chartGroupService.setCurrentView('CardsComponent');
        break;
      default:
        break;
    }
  }

  openModalExclude(layoutId: any, itemId: any, type: any): void {
    this.menuTriggers.forEach((trigger) => trigger.close());
    this.showModal = true;
    this.layoutId = layoutId;
    this.itemId = itemId;
    this.itemtype = type;
  }

  closeModalExclude(): void {
    this.showModal = false;
  }

  excludeItem() {
    switch (this.itemtype) {
      case 'card':
        this.chartsService.deleteCards(this.headers, this.itemId).subscribe({
          next: (value) => {
            this.messageService.add({
              severity: 'success',
              detail: 'Card Excluído',
            });
            setTimeout(() => {
              this.removeItem(this.layoutId);
            }, 80);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              detail: 'Não foi possível concluir esta ação',
            });
          },
        });
        break;
      case 'chart':
        this.chartsService.deleteCharts(this.headers, this.itemId).subscribe({
          next: (value) => {
            this.messageService.add({
              severity: 'success',
              detail: 'Gráfico Excluído',
            });
            setTimeout(() => {
              this.removeItem(this.layoutId);
            }, 80);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              detail: 'Não foi possível concluir esta ação',
            });
          },
        });
        break;
      case 'table':
        this.chartsService.deleteTables(this.headers, this.itemId).subscribe({
          next: (value) => {
            this.messageService.add({
              severity: 'success',
              detail: 'Tabela Excluída',
            });
            setTimeout(() => {
              this.removeItem(this.layoutId);
            }, 80);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              detail: 'Não foi possível concluir esta ação',
            });
          },
        });
        break;
      default:
        break;
    }
    this.closeModalExclude();
  }

  formatterResultWhenDecimal(result: number): string {
    let formattedResult;
    if (Number.isInteger(result)) {
      formattedResult = result.toLocaleString('pt-BR');
    } else {
      formattedResult = result.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return formattedResult;
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }

  onDragStarted(event: KtdDragStart) {
    this.isDragging = true;
  }

  onResizeStarted(event: KtdResizeStart) {
    this.isResizing = true;
  }

  onDragEnded(event: KtdDragEnd) {
    this.isDragging = false;
  }

  onResizeEnded(event: KtdResizeEnd) {
    this.isResizing = false;
  }

  toggleFullScreen() {
    this.filterModal = this.elementRef.nativeElement.querySelector('#modal');
    this.filterModal!.style.width = '0';
    const elem = this.fullScreenDiv.nativeElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      this.isFullScreen = true;
    } else if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      this.isFullScreen = false;
    }
    setTimeout(() => {
      this.updateCombinedLayout();
    }, 5540);
  }

  onFullScreenChange() {
    this.isFullScreen = !!document.fullscreenElement;
    if (this.isFullScreen) {
      this.rowHeight = 117;
    } else {
      this.rowHeight = 79;
    }
  }

  showFullScreen() {
    this.layout = this.layoutService.getLayout();
    document.addEventListener(
      'fullscreenchange',
      this.onFullScreenChange.bind(this)
    );
    document.addEventListener(
      'webkitfullscreenchange',
      this.onFullScreenChange.bind(this)
    );
    document.addEventListener(
      'mozfullscreenchange',
      this.onFullScreenChange.bind(this)
    );
    document.addEventListener(
      'MSFullscreenChange',
      this.onFullScreenChange.bind(this)
    );
  }

  hiddenFullscreen() {
    document.removeEventListener(
      'fullscreenchange',
      this.onFullScreenChange.bind(this)
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.onFullScreenChange.bind(this)
    );
    document.removeEventListener(
      'mozfullscreenchange',
      this.onFullScreenChange.bind(this)
    );
    document.removeEventListener(
      'MSFullscreenChange',
      this.onFullScreenChange.bind(this)
    );
  }

  stopEventPropagation(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  removeItem(id: string) {
    this.layout = ktdArrayRemoveItem(
      this.layout,
      (item: any) => item.id === id
    );
    this.startDashboarData();
  }

  openStructure() {
    this.router.navigate(['/admin/structure']);
  }
}
