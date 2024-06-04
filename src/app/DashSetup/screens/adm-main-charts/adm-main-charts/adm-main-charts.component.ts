import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
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
  MY_FORMATS,
  generateLayout2,
  ktdArrayRemoveItem,
} from '../../dashboards/view-create/utils';
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
  faEllipsisVertical,
  faPenToSquare,
  faTrash,
  faChartPie,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { TableModule } from 'primeng/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LayoutService } from '../../dashboards/view-create/layoutservice';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NgxSliderModule,
  Options,
  LabelType,
} from '@angular-slider/ngx-slider';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import * as _moment from 'moment';
import 'moment/locale/pt-br';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatDivider } from '@angular/material/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataService } from '../../../../core/services/dashboard/data.service';
import { LocalstorageService } from '../../../../core/services/local-storage/local-storage.service';

_moment.locale('pt-br');
registerLocaleData(localePt);

@Component({
  selector: 'app-adm-main-charts',
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
    HighchartsChartModule,
    FormsModule,
    TableModule,
    KtdGridModule,
    ToastModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
  templateUrl: './adm-main-charts.component.html',
  styleUrls: [
    './adm-main-charts.component.css',
    '../../dashboards/view-create/view-create.component.scss',
    '../../../../core/globalStyle/toast.css',
  ],
})
export class AdmMainChartsComponent implements OnInit {
  @ViewChildren(CdkMenuTrigger) menuTriggers!: QueryList<CdkMenuTrigger>;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild(KtdGridComponent, { static: true }) grid!: KtdGridComponent;
  private encryptedDataSubscription: Subscription | undefined;
  icons = {
    back: faRotateLeft,
    save: faFloppyDisk,
    filter: faFilter,
    menu: faEllipsisVertical,
    edit: faPenToSquare,
    delete: faTrash,
    dash: faChartPie,
    backDash: faArrowLeft,
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
  groupName: string = '';

  isEditingIndex: number | null = null;

  chartConfig: { [key: string]: Highcharts.Options } = {};
  charts: { [key: string]: Highcharts.Chart } = {};
  currentView: any;
  groupInfo: any;

  changeBg: HTMLElement | null = null;
  filterModal: HTMLElement | null = null;
  buttonMenuItem: HTMLElement | null = null;
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
  isLoginLoading: boolean = false;
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
    private localStorage: LocalstorageService,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.currentView = null;
  }

  ngOnInit(): void {
    this.startDashboarData();
    this.filters.forEach((filter, index) => {
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

    this.layout = this.layoutService.getLayout();
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
    if (this.encryptedDataSubscription) {
      this.encryptedDataSubscription.unsubscribe();
    }
  }

  startDashboarData() {
    const storedChartGroupString =
      this.localStorage.getDecryptedItem('chartGroup');
    const storedChartGroup = JSON.parse(storedChartGroupString);
    this.getCharts(storedChartGroup.id);
    this.getCards(storedChartGroup.id);
    this.getTables(storedChartGroup.id);
    this.groupName = storedChartGroup.name;
    this.groupInfo = storedChartGroup;
    console.log(storedChartGroup);
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
      this.copyDataCardJSON.push(table);
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
    console.log(chartData);
    this.copydataJSON = [];
    this.filters = [];
    this.chartGroupsData = [];

    chartData.forEach((chart: any) => {
      this.copyDataCardJSON.push(chart);
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

      for (const seriesCategory in seriesData) {
        if (seriesData.hasOwnProperty(seriesCategory)) {
          const dataset: number[] = categories.map(
            (category) => seriesData[seriesCategory][category] || 0
          );
          const pieData = data.yAxisColumns[0].data.map(
            (y: number, index: number) => ({
              name: data.series[0].data[index],
              y: y,
            })
          );
          if (data.graphType === 'pie') {
            highchartsSeries.push({
              type: data.graphType,
              name: data.series[0].name,
              colorByPoint: true,
              data: pieData,
            });
          } else {
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
    console.log(this.chartGroupsData);
  }

  public updateCombinedLayout() {
    const combinedData = [
      ...this.cardGroupsData,
      ...this.tableGroupsData,
      ...this.chartGroupsData,
    ];
    console.log(combinedData);
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

    this.originalLayout = JSON.parse(JSON.stringify(this.layout));
    this.saveNewLayoutUpdated = this.layout;
    console.log(this.layout);
  }

  onLayoutUpdated(layout: KtdGridLayout) {
    console.log('update', layout);
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
            setTimeout(() => {
              this.startDashboarData();
            }, 450);
          },
        });
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Disposição salva',
    });
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
    if (this.isShowFilterModal) {
      this.filterModal!.style.width = '330px';
    } else {
      this.filterModal!.style.width = '0';
    }
    setTimeout(() => {
      this.updateCombinedLayout();
    }, 440);
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

  isChecked(column: string, value: string): boolean {
    return this.checkedValues[column]?.includes(value) || false;
  }

  updateDropdownLabel(column: string) {
    const selectedValues = this.checkedValues[column];
    if (selectedValues && selectedValues.length > 0) {
      this.selectedFilters[column] = selectedValues.join(', ');
    } else {
      this.selectedFilters[column] = 'Todos';
    }
  }

  allfilters(values: string[], allfilters: string[]): string | string[] {
    if (values.length == allfilters.length) {
      const arraysIguais = values.every((value) => allfilters.includes(value));
      if (arraysIguais) {
        return 'Todos';
      }
    }
    return values;
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
    for (const chartGroup of filteredChartData) {
      if (chartGroup.filters) {
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
          const selectedValue = this.selectedFilters[filter.column[0]];
          if (selectedValue && selectedValue !== 'Todos') {
            filter.value = selectedValue.split(', ');
          } else if (selectedValue && selectedValue === 'Todos') {
            filter.value = [];
          }
        }
      }
    }

    const filteredTableData = JSON.parse(
      JSON.stringify(this.copyDataTableJSON)
    );
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
          const selectedValue = this.selectedFilters[filter.column[0]];
          if (selectedValue && selectedValue !== 'Todos') {
            filter.value = selectedValue.split(', ');
          } else if (selectedValue && selectedValue === 'Todos') {
            filter.value = [];
          }
        }
      }
    }

    const filteredCardData = JSON.parse(JSON.stringify(this.copyDataCardJSON));
    for (const cardGroup of filteredCardData) {
      if (cardGroup.filters) {
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
          const selectedValue = this.selectedFilters[filter.column[0]];
          if (selectedValue && selectedValue !== 'Todos') {
            filter.value = selectedValue.split(', ');
          } else if (selectedValue && selectedValue === 'Todos') {
            filter.value = [];
          }
        }
      }
    }

    console.log(filteredChartData);
    console.log(filteredTableData);
    console.log(filteredCardData);

    this.updateChartGroupsData(filteredChartData);
    this.updateTableGroupsData(filteredTableData);
    this.updateCardGroupsData(filteredCardData);
  }

  updateChartGroupsData(filteredChartData: any[]) {
    filteredChartData.forEach((data: any) => {
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
    });
  }

  updateTableGroupsData(filteredTableGroupsData: any) {
    filteredTableGroupsData.forEach((data: any) => {
      this.updateTables(data.id, data.tableData, data.filters);
    });
  }

  updateCardGroupsData(cardGroupsData: any) {
    cardGroupsData.forEach((data: any) => {
      this.updateCards(data.id, data.sql, data.filters);
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

    console.log(id, JSON.stringify(requestData, null, 2));
    this.chartsService.updateCharts(this.headers, requestData, id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getCharts(data.chartGroup.id);
      },
      error: (error: any) => {
        console.error('Erro ao atualizar o gráfico:', error);
      },
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
        console.log(data);
        this.getTables(data.chartGroup.id);
      },
      error: (err: any) => {
        console.log('erro ao atualizar tabela', err);
      },
    });
  }

  updateCards(id: string, sql: string, filters: any) {
    console.log(filters);
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

    console.log(formattedFilters);
    this.chartsService.updateCards(this.headers, requestData, id).subscribe({
      next: (data: any) => {
        console.log('card: ', data);
        this.getCards(data.chartGroup.id);
      },
      error(err) {
        console.log('erro ao atualizar card', err);
      },
    });
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

  backScreenDash() {
    this.router.navigate(['/admin/adm_main_dashboard']);
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
}
