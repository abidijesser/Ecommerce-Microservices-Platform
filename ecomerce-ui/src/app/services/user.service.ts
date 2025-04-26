import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  getAllUsers() :Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiBaseUrl}/user`);
  }
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/user/${id}`);
  }
}
