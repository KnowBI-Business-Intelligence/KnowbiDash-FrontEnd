import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartsService } from '../../../core/services/charts/charts.service';
import { StorageService } from '../../../core/services/user/storage.service';

@Component({
  selector: 'app-adm-main-screen',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './adm-main-screen.component.html',
  styleUrl: './adm-main-screen.component.css',
})
export class ADMMainScreenComponent {
  private user: any;
  listpages: any;
  filteredItems: any;

  constructor(private charts: ChartsService, private token: StorageService) {}

  ngOnInit(): void {
    this.getFolders();
  }

  onInputChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      this.filteredItems = this.listpages;
      return;
    }

    this.filteredItems = this.listpages.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm)
    );
  }

  clear() {
    throw new Error('Method not implemented.');
  }

  private getFolders() {
    this.user = this.token.getUser();

    if (!this.user || !this.user.token) {
      console.error('Token não disponível');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.user.token}`,
    });

    const that = this;

    this.charts.getChartsPath(headers).subscribe({
      next(value: any) {
        that.listpages = value;
        that.filteredItems = value;
      },
      error(err: Error) {
        console.error(err);
      },
    });
  }
}
