import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as _moment from 'moment';
import 'moment/locale/pt-br';

_moment.locale('pt-br');

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet],
})
export class AppComponent {}
