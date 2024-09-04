import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../entity/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  url = 'http://localhost:9999/budgets'

  constructor(private http: HttpClient) { }

  getToken()
  {
    const token = localStorage.getItem('token')
    return token
  }
  getHeaders()
  {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.getToken()
    })
    return headers
  }
  getEmail(){
    const email = localStorage.getItem('email')
    return email
  }

  // Fetching data

  createBudget(budget: Budget): Observable<Object>{
    const headers = this.getHeaders()
    return this.http.post<Object>(this.url+`/create`, budget, { headers })
  }

  getAllBudgets(): Observable<Budget[]>{
    const headers = this.getHeaders()
    return this.http.get<Array<Budget>>(this.url, { headers })
  }

  getBudgetById(id: number): Observable<Object>{
    const headers = this.getHeaders()
    return this.http.get<Budget>(this.url+`/${id}`, { headers })
  }

  getBudgetByEmail(): Observable<Budget[]>{
    const headers = this.getHeaders()
    const email = this.getEmail()
    return this.http.get<Array<Budget>>(this.url+`/email/${email}`, { headers })
  }

  getBudgetByCategory(category: string): Observable<Budget[]>{
    const headers = this.getHeaders()
    return this.http.get<Array<Budget>>(this.url+`/category/${category}`, { headers })
  }

  updateBudget(id: number, budget: Budget): Observable<Object>{
    const headers = this.getHeaders()
    return this.http.put(this.url+`/${id}`, budget, { headers })
  }

  deleteBudget(id: number, budget: Budget): Observable<Object>{
    const headers = this.getHeaders()
    return this.http.delete(this.url+`/${id}`, { headers })
  }
}
