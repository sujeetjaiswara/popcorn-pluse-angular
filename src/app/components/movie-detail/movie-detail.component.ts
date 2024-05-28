import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent {
  movie = input<Movie | null>();
  protected movieService = inject(MovieService);

  getPoster = computed(() => {
    return `https://image.tmdb.org/t/p/w220_and_h330_face${
      this.movieService.selectedMovie()?.poster_path
    }`;
  });
}
