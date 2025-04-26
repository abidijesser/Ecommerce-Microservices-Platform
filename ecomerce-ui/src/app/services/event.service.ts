import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/events`);
  }

  createEvent(event:any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/events`, event, { responseType: 'text' });
  }

  updateEvent(eventId: string, event: any): Observable<any> {
    return this.http.put<any>(`${environment.apiBaseUrl}/events/${eventId}`, event);
  }

  deleteEvent(eventId: string): Observable<string> {
    return this.http.delete(`${environment.apiBaseUrl}/events/${eventId}`, { responseType: 'text' });
  }

  participate(eventId: string, userId: string): Observable<string> {
    return this.http.post(`${environment.apiBaseUrl}/events/${eventId}/participate`, userId, { responseType: 'text' });
  }
  rateEvent(eventId: string, userId: string, value: number): Observable<string> {
    return this.http.post(`${environment.apiBaseUrl}/events/${eventId}/rate`, { userId, value }, { responseType: 'text' });
  }

  uploadCover(eventId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiBaseUrl}/events/cover/${eventId}`, formData);
  }
}
