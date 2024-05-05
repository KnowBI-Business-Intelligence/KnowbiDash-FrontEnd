import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.item = this.router.getCurrentNavigation()?.extras.state?.['item'];
    console.log(this.item);
  }
  clear() {}

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
}
