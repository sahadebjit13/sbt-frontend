import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../entity/expense';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  
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


  url = 'http://localhost:9999/expenses'
  createExpense(expense: Expense): Observable<Object>{
    const headers = this.getHeaders()
    return this.http.post<Expense>(this.url+`/create`, expense, { headers })
  }

  updateExpense(id: number, updatedExpense: Expense): Observable<Object>{
    const headers = this.getHeaders()
    return this.http.put<Expense>(this.url+`/update/${id}`, updatedExpense, { headers })
  }

  getTotalExpenses(): Observable<number>{
    const headers = this.getHeaders()
    const email = localStorage.getItem('email')
    return this.http.get<number>(this.url+`/total/${email}`, { headers })
  }

  getExpensesByCategory(category: string): Observable<Object> {
    const headers = this.getHeaders()
    return this.http.get(this.url+`/category/${category}`, { headers })
  }

  getAllExpenses(): Observable<Expense[]>{
    const headers = this.getHeaders()
    return this.http.get<Expense[]>(this.url+`/all`, { headers })
  }

  getExpenseByEmail(): Observable<Expense[]>{
    const headers = this.getHeaders()
    const email = localStorage.getItem('email')
    return this.http.get<Expense[]>(this.url+`/email/${email}`, { headers })
  }

  getExpenseById(id: string): Observable<Object>{
    const headers = this.getHeaders()
    return this.http.get<Expense[]>(this.url+`/${id}`, { headers })
  }

  deleteExpense(id: string): Observable<Object> {
    const headers = this.getHeaders()
    return this.http.delete<Expense[]>(this.url+`/${id}`, { headers })}

  getBudgetSummary(): Observable<Map<string, string>> {
    const headers = this.getHeaders()
    const email = localStorage.getItem('email')
    return this.http.get<Map<string,string>>(this.url+`/budgetsummary/${email}`, { headers })
  }

}
