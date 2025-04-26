import { Component } from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-admin',
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet

  ],
  templateUrl: './admin.component.html',
  standalone: true,
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
