import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {UserService} from './services/user.service';
import {AdminComponent} from './admin/admin.component';
import {KeycloakService} from './utils/keycloak/keycloak.service';
import {filter, take} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'ecomerce-ui';
   userService=inject(UserService);
  keycloakService=inject(KeycloakService);
  router=inject(Router);

  ngOnInit(): void {
     this.userService.getAllUsers().subscribe(
       (res) => {
         console.log(res);
       },
       (error) => {
         console.error('Error fetching users:', error);
       }
     );
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1) // Only once on app init
      )
      .subscribe(() => {
        const currentUrl = this.router.url;
        console.log('✅ Final route after navigation:', currentUrl);

        if (this.keycloakService.isInitialized && currentUrl === '/') {
          if (this.keycloakService.hasRole('admin')) {
            this.router.navigate(['/back']);
          } else {
            this.router.navigate(['/front']);
          }
        }
      });


  }

}
