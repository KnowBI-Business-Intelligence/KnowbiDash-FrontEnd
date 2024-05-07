import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartsService } from '../../../../core/services/charts/charts.service';
import { StorageService } from '../../../../core/services/user/storage.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent implements OnInit {
  private item: any;
  listcharts: any;
  filteredItems: any;
  private user = this.storageService.getUser();

  constructor(
    private charts: ChartsService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.item = history.state;
    this.getFolders();
  }

  private getFolders() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    this.charts.getChartGroup(headers).subscribe({
      next: (value: any) => {},
    });
  }

  openNext(item: any) {
    this.router.navigate(['admin/charts'], { state: item });
  }

  backScreen() {
    this.router.navigate(['/admin']);
  }

  onInputChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      this.filteredItems = this.listcharts;
      return;
    }

    this.filteredItems = this.listcharts.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm)
    );
  }

  clear(event: MouseEvent) {
    const searchTerm = (event.target as HTMLElement)
      .closest('.content-filter')
      ?.querySelector('input');
    if (searchTerm) {
      searchTerm.value = '';
    }
    this.filteredItems = this.listcharts;
    return;
  }
}
