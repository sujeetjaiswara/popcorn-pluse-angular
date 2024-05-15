import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MovieDetailPageComponent } from './pages/movie-detail-page/movie-detail-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'movie/:id',
    component: MovieDetailPageComponent,
  },
];
