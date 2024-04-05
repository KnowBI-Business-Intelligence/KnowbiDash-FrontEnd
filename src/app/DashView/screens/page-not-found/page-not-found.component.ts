import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent implements OnInit {
  number: HTMLElement | null = null;

  constructor(private router: Router) {}

  updateSeconds(seconds: number) {
    if (this.number) {
      this.number.textContent = `Vamos te levar de volta em ${seconds} segundos!`;
    }
  }

  startCountdown(seconds: number) {
    this.updateSeconds(seconds);

    const cont = setInterval((): any => {
      seconds--;
      this.updateSeconds(seconds);

      if (seconds == 0) {
        this.router.navigateByUrl('/login');
        clearInterval(cont);
      }
    }, 500);
  }

  ngOnInit(): void {
    this.number = document.querySelector('#seconds');

    this.startCountdown(5);
  }
}
