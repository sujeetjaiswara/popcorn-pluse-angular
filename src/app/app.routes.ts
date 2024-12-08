import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie-detail-page/movie-detail-page.component').then(
        (m) => m.MovieDetailPageComponent,
      ),
  },
];
