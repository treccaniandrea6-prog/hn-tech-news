import { Routes } from '@angular/router';
import { NewsPageComponent } from './features/news/news-page/news-page';

export const routes: Routes = [
  { path: '', component: NewsPageComponent },
  { path: '**', redirectTo: '' },
];