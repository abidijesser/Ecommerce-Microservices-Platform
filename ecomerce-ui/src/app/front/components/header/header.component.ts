import {Component, inject} from '@angular/core';
import {KeycloakService} from '../../../utils/keycloak/keycloak.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  keycloakService = inject(KeycloakService);

  logout() {
    this.keycloakService.logout();

  }
}
