import { Component } from '@angular/core';
import { NewsService } from '../service/news.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  
  t:any =[]

  constructor(private newsService: NewsService){
    this.newsService.getNews().subscribe(data => {
      this.t = data["articles"].filter((news: any) => news.title != '[Removed]')
      console.log('loaded');
      
    })
  }
}
