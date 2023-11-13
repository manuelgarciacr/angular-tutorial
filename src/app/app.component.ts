import { Component } from '@angular/core';
import {  } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../infrastructure/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-tutorial';
}
