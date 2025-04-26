import { Routes } from '@angular/router';
import {PanierComponent} from './front/panier/panier.component';
import {PaymentSuccessComponent} from './front/pages/payment-success/payment-success.component';
import {UserListComponent} from './admin/pages/user-list/user-list.component';
import {ProductListComponent} from './admin/pages/product-list/product-list.component';
import {OrderListComponent} from './admin/pages/order-list/order-list.component';
import {ReclamationListComponent} from './admin/pages/reclamation-list/reclamation-list.component';
import {PaymentListComponent} from './admin/pages/payment-list/payment-list.component';
import {EventListComponent} from './admin/pages/event-list/event-list.component';

export const routes: Routes = [
  {path:'front',loadComponent: () => import('./front/front.component').then(m => m.FrontComponent),
  children: [
    { path: 'panier', component: PanierComponent },
  ]},
  { path: 'payment-success', component: PaymentSuccessComponent },
  {path:'back',loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  children: [
    { path: '', component: UserListComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'orders', component: OrderListComponent },
    { path: 'reclamations', component: ReclamationListComponent },
    { path: 'payments', component: PaymentListComponent },
    { path: 'events', component: EventListComponent},
    ]},

];
