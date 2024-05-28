import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectorRef,
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
  rowHeight: number = 75;
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

  isEditingIndex: number | null = null;

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
    this.copydataJSON = [];
    this.filters = [];
    this.chartGroupsData = [];
    chartData.forEach((chart: any) => {
      this.copyDataCardJSON.push(chart);
      this.chartFilters.push(chart.filters);
    });

    chartData.forEach((dataItem: any) => {
      if (dataItem.chartGroup.id === groupId) {
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
          id: dataItem.id,
          data: chartConfig,
          type: 'chart',
          chartgroup: dataItem.chartGroup,
          workspace: dataItem.workspace,
          filters: dataItem.filters,
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
    this.initFilters(this.groupInfo.id, combinedData);
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
    console.log('update: ', layout);
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

  updateFilterLabel(index: number): void {
    this.isEditingIndex = index;
  }

  saveFilterLabel(): void {
    if (this.isEditingIndex !== null) {
      const updatedIdentifiers =
        this.filters[this.isEditingIndex].identifiers.flat(Infinity);
      this.filters[this.isEditingIndex].identifiers = updatedIdentifiers;

      this.printNewValue(updatedIdentifiers);
      this.isEditingIndex = null;
      this.executeFilter();
    }
  }

  printNewValue(value: string[]): void {
    console.log('Novo valor:', JSON.stringify(value, null, 2));
    console.log(JSON.stringify(this.filters, null, 2));
  }

  addFilters(filters: any[]) {
    this.selectedFilters = [];
    if (!filters) {
      console.error('filters is undefined or null');
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
          });
        }
      }
    });

    console.log(this.filters);
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
    console.log(this.filters);
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
    const filter = this.filters.find((f) => f.column === column);
    if (filter) {
      // Verifica se o valor está nos valores do filtro correspondente
      const isValueInFilters = filter.values.includes(value);
      // Verifica se o valor está na lista de valores marcados
      const isValueChecked =
        this.checkedValues[column]?.includes(value) || false;
      // Retorna verdadeiro se o valor estiver em qualquer uma das listas
      return isValueInFilters || isValueChecked;
    }
    return false;
  }

  updateDropdownLabel(column: string) {
    const selectedValues = this.checkedValues[column];
    if (selectedValues && selectedValues.length > 0) {
      this.selectedFilters[column] = selectedValues.join(', ');
    } else {
      this.selectedFilters[column] = 'Todos';
    }
  }

  alfilters(values: string[], allfilters: string[]): string | string[] {
    if (values.length === allfilters.length) {
      const arraysIguais = values.every((value) => allfilters.includes(value));
      if (arraysIguais) {
        return 'todos';
      }
    }
    return values;
  }

  executeFilter() {
    const flattenIdentifiers = (identifiers: any[]) =>
      identifiers.flat(Infinity);

    const filteredChartData = JSON.parse(JSON.stringify(this.copydataJSON));
    for (const chartGroup of filteredChartData) {
      if (chartGroup.filters) {
        for (const filter of chartGroup.filters) {
          this.filters.map((data) => {
            if (filter.column == data.column) {
              filter.identifiers[0] = flattenIdentifiers(data.identifiers);
            }
          });
          const selectedValue = this.selectedFilters[filter.column[0]];
          if (selectedValue && selectedValue !== 'Todos') {
            filter.value = selectedValue.split(', ');
          } else if (selectedValue && selectedValue === 'Todos') {
            console.log(selectedValue);
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
            if (filter.column == data.column) {
              filter.identifiers[0] = flattenIdentifiers(data.identifiers);
            }
          });
          const selectedValue = this.selectedFilters[filter.column[0]];
          console.log(selectedValue);
          if (selectedValue && selectedValue !== 'Todos') {
            console.log(selectedValue);
            filter.value = selectedValue.split(', ');
          } else if (selectedValue && selectedValue === 'Todos') {
            console.log(selectedValue);
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
            if (filter.column == data.column) {
              filter.identifiers[0] = flattenIdentifiers(data.identifiers);
            }
          });
          const selectedValue = this.selectedFilters[filter.column[0]];
          if (selectedValue && selectedValue !== 'Todos') {
            filter.value = selectedValue.split(', ');
          } else if (selectedValue && selectedValue === 'Todos') {
            console.log(selectedValue);
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
        data.filters
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

    const formattedSeries = series.map((column) => ({
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
      series: formattedSeries,
      filters: formattedFilters,
    };

    this.chartsService.updateCharts(this.headers, requestData, id).subscribe({
      next: (data: any) => {
        console.log('chart: ', data);
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
        console.log('table: ', data);
        this.getTables(data.chartGroup.id);
      },
      error: (err: any) => {
        console.log('erro ao atualizar tabela', err);
      },
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
