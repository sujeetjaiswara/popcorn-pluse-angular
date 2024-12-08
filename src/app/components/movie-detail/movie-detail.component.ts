import { CurrencyPipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Movie } from '../../models';
import { MovieService } from '../../services';

@Component({
  selector: 'app-movie-detail',
  imports: [DecimalPipe, CurrencyPipe, NgOptimizedImage],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent {
  movie = input.required<Movie | null>();
  protected movieService = inject(MovieService);

  getPoster = computed(() => {
    return `https://image.tmdb.org/t/p/w500${this.movieService.selectedMovie()?.poster_path}`;
  });

  getBackdrop = computed(() => {
    return `https://image.tmdb.org/t/p/w780${this.movieService.selectedMovie()?.backdrop_path}`;
  });
}
