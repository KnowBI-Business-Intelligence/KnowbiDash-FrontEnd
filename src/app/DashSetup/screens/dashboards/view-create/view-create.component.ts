import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  KtdDragEnd,
  KtdDragStart,
  KtdGridComponent,
  KtdGridLayout,
  KtdGridLayoutItem,
  KtdGridModule,
  KtdResizeEnd,
  KtdResizeStart,
  ktdTrackById,
} from '@katoid/angular-grid-layout';
import { ktdArrayRemoveItem } from './utils';
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
} from '@fortawesome/free-solid-svg-icons';
import { TableModule } from 'primeng/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LayoutService } from './layoutservice';

interface ExtendedOptions extends Highcharts.Options {
  filters?: any;
}

@Component({
  selector: 'app-view-create',
  standalone: true,
  imports: [
    MatIconModule,
    FontAwesomeModule,
    CommonModule,
    SkeletonModule,
    HighchartsChartModule,
    FormsModule,
    TableModule,
    KtdGridModule,
  ],
  templateUrl: './view-create.component.html',
  styleUrl: './view-create.component.css',
})
export class ViewCreateComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild(KtdGridComponent, { static: true }) grid!: KtdGridComponent;
  private encryptedDataSubscription: Subscription | undefined;

  icons = {
    back: faRotateLeft,
    save: faFloppyDisk,
    filter: faFilter,
  };

  cols: number = 15;
  rowHeight: number = 85;
  compactType: 'vertical' | 'horizontal' | null = 'horizontal';

  layout: KtdGridLayout = [];

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

  chartConfig: any;
  currentView: any;
  groupInfo: any;

  changeBg: HTMLElement | null = null;
  filterModal: HTMLElement | null = null;

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
  selectedFilters: any = {};
  checkedValues: any = {};
  copydataJSON: any[] = [];
  selectedGroupId: any = null;
  originalChartData: ChartData[] = [];
  chartData: ChartData[] = [];
  cardsData: any[] = [];
  tableData: any[] = [];
  showTableColumns: any[] = [];
  showTableData: any[] = [];
  originalLayout: any[] = [];

  saveNewLayoutUpdated: KtdGridLayout = [];

  isShowFilterModal: boolean = false;
  isLoginLoading: boolean = false;
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
    {
      name: 'ease-out',
      value:
        'transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out',
    },
    {
      name: 'linear',
      value: 'transform 500ms linear, width 500ms linear, height 500ms linear',
    },
    {
      name: 'overflowing',
      value:
        'transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)',
    },
    {
      name: 'fast',
      value: 'transform 200ms ease, width 200ms linear, height 200ms linear',
    },
    {
      name: 'slow-motion',
      value:
        'transform 1000ms linear, width 1000ms linear, height 1000ms linear',
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
    private ngZone: NgZone,
    public elementRef: ElementRef,
    private layoutService: LayoutService,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.currentView = null;
  }

  ngOnInit(): void {
    this.startDashboarData();

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
    if (this.encryptedDataSubscription) {
      this.encryptedDataSubscription.unsubscribe();
      this.resizeSubscription.unsubscribe();
    }
  }

  startDashboarData() {
    this.encryptedDataSubscription =
      this.chartGroupService.encryptedData$.subscribe((encryptedData) => {
        console.log(encryptedData);
        this.groupInfo = encryptedData;
        this.getCharts(encryptedData.id);
        this.getCards(encryptedData.id);
        this.getTables(encryptedData.id);
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
    this.cardGroupsData = [];
    cardData.forEach((card: any) => {
      if (card.chartGroup.id == groupId) {
        let result = null;
        if (typeof card.result === 'number') {
          result = this.formatterResultWhenDecimal(card.result);
        } else {
          result = card.result;
        }
        let cardTitle = card.title;
        let cardResult = card.prefix + '' + result + ' ' + card.sufix;

        let finalData = {
          title: cardTitle,
          type: 'card',
          content: cardResult,
          workspace: card.workspace,
          chartgroup: card.chartGroup,
        };

        this.cardGroupsData.push(finalData);
      }
    });

    this.updateCombinedLayout();
  }

  loadTables(tableData: any, groupId: any) {
    this.tableGroupsData = [];

    tableData.forEach((table: any) => {
      if (
        table.chartGroup.id == groupId &&
        table.tableData &&
        table.tableData.length > 0
      ) {
        const tableGroup: any = {
          type: 'table',
          title: table.title,
          showTableColumns: [],
          showTableData: [],
          chartgroup: table.chartGroup,
          workspace: table.workspace,
        };

        const columns = table.tableData.map((td: any) => td.column).flat();
        tableGroup.showTableColumns = columns.map((col: string) => ({
          name: col,
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
    this.chartGroupsData = [];
    this.copydataJSON = [];
    this.filters = [];

    chartData.forEach((chart: any) => {
      if (chart.chartGroup && chart.chartGroup.id == groupId) {
        chart.filters.forEach((filter: any) => {
          const existingFilter = this.filters.find(
            (f) => f.column === filter.column[0]
          );
          if (existingFilter) {
            if (!existingFilter.values.includes(filter.value[0])) {
              existingFilter.values.push(filter.value[0]);
            }
          } else {
            this.filters.push({
              column: filter.column[0],
              values: filter.value,
              identifiers: filter.identifiers,
              allfilters: filter.allfilters,
            });
          }
        });
      }
    });

    chartData.forEach((dataItem: any) => {
      if (dataItem.chartGroup.id == groupId) {
        console.log(dataItem);
        this.copydataJSON.push(dataItem);
        const uniqueCategories: any = Array.from(
          new Set(dataItem.xAxisColumns[0].data)
        );

        const uniqueSubgroups = Array.from(new Set(dataItem.series[0].data));

        const seriesData = uniqueSubgroups.map((subgrupo: any) => {
          const seriesValues: { name: string; y: any }[] = [];
          dataItem.xAxisColumns[0].data.forEach((date: string, i: number) => {
            if (dataItem.series[0].data[i] === subgrupo) {
              seriesValues.push({
                name: date,
                y: dataItem.yAxisColumns[0].data[i],
              });
            }
          });
          return {
            type: dataItem.graphType,
            name: subgrupo,
            height: '20%',
            data: seriesValues,
          };
        });
        const chartConfig: ExtendedOptions = {
          chart: {
            type: dataItem.graphType,
          },
          title: {
            text: dataItem.title,
            style: {
              fontSize: '13px',
              fontWeight: '450',
            },
          },
          xAxis: {
            categories: uniqueCategories,
            title: {
              text: dataItem.xAxisColumns[0].name[0],
            },
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
          yAxis: {
            title: {
              text: dataItem.yAxisColumns[0].name[0],
            },
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
          series: seriesData,
          tooltip: {
            shared: true,
          },
          legend: {
            maxHeight: 65,
            itemStyle: {
              fontSize: '10px',
            },
          },
          plotOptions: {
            series: {
              cursor: 'pointer',
              point: {
                events: {
                  click: function () {
                    console.log('Coluna clicada:', this.category, this.y);
                  },
                },
              },
            },
          },
          filters: dataItem.filters,
        };

        const chartDataFinal = {
          data: chartConfig,
          type: 'chart',
          chartgroup: dataItem.chartGroup,
          workspace: dataItem.workspace,
        };

        this.chartGroupsData.push(chartDataFinal);
      }
    });
    this.updateCombinedLayout();
  }

  public updateCombinedLayout() {
    const combinedData = [
      ...this.cardGroupsData,
      ...this.tableGroupsData,
      ...this.chartGroupsData,
    ];
    this.updateLayout(combinedData);
  }

  updateLayout(data: any) {
    this.layout = [];
    this.layout = [
      ...data.map((item: any) => {
        if (item.type == 'card') {
          return {
            id: item.workspace.id,
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
      console.log(data.identifier);

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
            console.log(value);
          },
        });
    });
  }

  openModal(): void {
    this.showFilters();
    console.log(this.filters);
    /*let filterValuesByColumn: { [key: string]: string[] } = {};

    this.chartGroupsData.forEach((data: any) => {
      data.filters.forEach((filter: any) => {
        if (!(filter.column[0] in filterValuesByColumn)) {
          filterValuesByColumn[filter.column[0]] = [];
        }
        filter.value.forEach((value: string) => {
          if (!filterValuesByColumn[filter.column[0]].includes(value)) {
            filterValuesByColumn[filter.column[0]].push(value);
          }
        });
      });
    });

    this.filters.forEach((filter: any) => {
      filter.values = filterValuesByColumn[filter.column];
    });*/
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
    return (
      this.checkedValues[column] && this.checkedValues[column].includes(value)
    );
  }

  updateDropdownLabel(column: string): void {
    if (this.checkedValues[column] && this.checkedValues[column].length > 0) {
      this.selectedFilters[column] = this.checkedValues[column].join(', ');
    } else {
      this.selectedFilters[column] = 'Todos';
    }
  }

  allValuesMatchAllFilters(values: any[], allFilters: any[]): boolean {
    return values.every((value) => allFilters.includes(value));
  }

  executeFilter() {
    if (this.copydataJSON.length > 0) {
      const filteredChartData = JSON.parse(JSON.stringify(this.copydataJSON));
      for (const chartGroup of filteredChartData) {
        if (chartGroup.filters) {
          for (const filter of chartGroup.filters) {
            const selectedValue = this.selectedFilters[filter.column[0]];
            if (selectedValue && selectedValue !== 'Todos') {
              filter.value = selectedValue.split(', ');
            }
          }
        }
      }
      //this.updateChartGroupsData(filteredChartData);
      console.log(filteredChartData);
    }
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
        data.filters
      );
    });
  }

  updateChart(
    id: string,
    sql: string,
    xAxisColumns: any[],
    yAxisColumns: any[],
    filters: any[]
  ) {
    const formattedXAxisColumns = xAxisColumns.map((column) => ({
      name: column.column,
      identifiers: column.name,
    }));

    const formattedYAxisColumns = yAxisColumns.map((column) => ({
      name: column.column,
      identifiers: column.name,
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
      filters: formattedFilters,
    };

    const user = this.storageService.getUser();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
    this.chartsService.updateCharts(headers, requestData, id).subscribe({
      next: (data: any) => {
        console.log('Gráfico atualizado:', data);
        this.getCharts(id);
        this.chartGroupsData = [];
        this.copydataJSON = [];
      },
      error: (error: any) => {
        console.error('Erro ao atualizar o gráfico:', error);
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
  }
}
