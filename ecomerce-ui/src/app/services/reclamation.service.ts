import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
export interface Reclamation {
  _id: string;
  name: string;
  number: string;
  email: string;
  description: string;
}
@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  constructor(private http: HttpClient) {}

  createReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${environment.apiBaseUrl}/reclamations`, reclamation);
  }

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${environment.apiBaseUrl}/reclamations`);
  }
  deleteReclamation(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/reclamations/${id}`);
  }
}
