import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: any | undefined;
  private _isInitialized = false;

  constructor() { }
  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url:'http://localhost:9090',
        realm: 'micro-services',
        clientId:'micro-services-api'
      });
    }
    return this._keycloak;
  }
  async init() {
   const authenticated = await this.keycloak.init({
     onLoad: 'login-required',
   });
    this._isInitialized = authenticated;
    return authenticated;
  }
  get isInitialized(): boolean {
    return this._isInitialized;
  }
  async login() {
    await this.keycloak.login();
  }
  get userId() :string {
    return this.keycloak.tokenParsed?.sub as string;
  }
  get isTokenValid() :boolean {
    return !this.keycloak.isTokenExpired();
  }
  get fullName() :string {
    return this.keycloak.tokenParsed?.['name'] as string;
  }
  logout() {
    return this.keycloak.logout({ redirectUri: 'http://localhost:4200' });
  }
  accountManagement() {
    return this.keycloak.accountManagement();
  }
  get roles(): string[] {
    const resourceAccess = this.keycloak.tokenParsed?.resource_access;
    const clientRoles = resourceAccess?.['micro-services-api']?.roles || [];
    return clientRoles;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

}
