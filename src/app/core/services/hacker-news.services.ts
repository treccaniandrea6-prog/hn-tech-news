import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

import { HackerNewsItem } from '../../models/hn-item.model';

@Injectable({ providedIn: 'root' })
export class HackerNewsService {
  private readonly baseUrl = 'https://hacker-news.firebaseio.com/v0';

  constructor(private http: HttpClient) {}

  getNewStoryIds(): Observable<number[]> {
    return this.http
      .get<number[]>(`${this.baseUrl}/newstories.json`)
      .pipe(timeout(10000));
  }

  getItem(id: number): Observable<HackerNewsItem> {
    return this.http
      .get<HackerNewsItem>(`${this.baseUrl}/item/${id}.json`)
      .pipe(timeout(10000));
  }
}