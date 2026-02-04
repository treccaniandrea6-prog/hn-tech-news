import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { HackerNewsService } from '../../../core/services/hacker-news.services';
import { NewsItem } from '../../../models/news.model';
import { HackerNewsItem } from '../../../models/hn-item.model';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-page.html',
  styleUrl: './news-page.scss',
})
export class NewsPageComponent implements OnInit {
  allIds: number[] = [];
  news: NewsItem[] = [];

  loading = false;
  error = '';

  private page = 0;
  private readonly pageSize = 10;

  constructor(
    private hn: HackerNewsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitial();
  }

  loadInitial(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.hn.getNewStoryIds().subscribe({
      next: (ids: number[]) => {
        this.allIds = Array.isArray(ids) ? ids : [];
        this.page = 0;
        this.news = [];

        this.cdr.detectChanges();
        this.loadMore();
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load news list.';
        this.cdr.detectChanges();
      },
    });
  }

  loadMore(): void {
    if (!this.allIds.length) {
      this.loading = false;
      this.error = 'No news IDs available.';
      this.cdr.detectChanges();
      return;
    }

    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    const slice = this.allIds.slice(start, end);

    if (!slice.length) return;

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    forkJoin(
      slice.map((id) =>
        this.hn.getItem(id).pipe(
          catchError(() => of(null as unknown as HackerNewsItem | null))
        )
      )
    )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (items: (HackerNewsItem | null)[]) => {
          const mapped: NewsItem[] = items
            .filter((it): it is HackerNewsItem => !!it)
            .map((it) => ({
              id: it.id,
              title: it.title ?? 'Untitled news',
              url: it.url ?? `https://news.ycombinator.com/item?id=${it.id}`,
              date: new Date((it.time ?? 0) * 1000),
            }));

          this.news = [...this.news, ...mapped];
          this.page += 1;

          if (!this.news.length) {
            this.error = 'No news available.';
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Failed to load news details.';
          this.cdr.detectChanges();
        },
      });
  }

  get canLoadMore(): boolean {
    return this.allIds.length > this.page * this.pageSize;
  }
}