import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-number-of',
  standalone: true,
  imports: [],
  templateUrl: './cards-number-of.component.html',
  styleUrl: './cards-number-of.component.css',
})
export class CardsNumberOfComponent {
  @Input() number_of_something: string | undefined;
  @Input() title_of_something: string | undefined;
}
