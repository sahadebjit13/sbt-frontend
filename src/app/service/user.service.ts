import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:9999/auth'

  constructor(private http: HttpClient) { }
  
  register(user: User): Observable<Object> {
     return this.http.post<Object>(this.url+`/signup`, user)
  }

  authenticate(user: User) {
    return this.http.post<Object>(this.url+`/login`, user)
 }
}
