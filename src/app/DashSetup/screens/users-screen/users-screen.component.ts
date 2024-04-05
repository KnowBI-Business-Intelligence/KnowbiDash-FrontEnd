import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './users-screen.component.html',
  styleUrl: './users-screen.component.css',
})
export class UsersScreenComponent {}
