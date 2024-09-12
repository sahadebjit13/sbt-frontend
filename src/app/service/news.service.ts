import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  url = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=f37bec3086464efc9fa6b0811903ed5d"
  constructor(private http:HttpClient) { }
  getNews() : Observable<any> {
    return this.http.get(this.url)
  }
}
