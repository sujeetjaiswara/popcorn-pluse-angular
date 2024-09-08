import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { MovieDetailComponent } from '../../components';
import { Movie } from '../../models';
import { DataService, MovieService } from '../../services';
import { MovieDetailShimmerComponent } from './movie-detail-shimmer/movie-detail-shimmer.component';

@Component({
  selector: 'app-movie-detail-page',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe, MovieDetailComponent, MovieDetailShimmerComponent],
  templateUrl: './movie-detail-page.component.html',
  styleUrl: './movie-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailPageComponent {
  #cd = inject(ChangeDetectorRef);
  #route = inject(ActivatedRoute);
  #destroyRef: DestroyRef = inject(DestroyRef);
  #dataService = inject(DataService);
  #movieService = inject(MovieService);
  movie$!: Movie | null;
  isLoading = signal(true);

  constructor() {
    afterNextRender(() => {
      const movieId = Number(this.#route.snapshot.paramMap.get('id'));
      this.getDetail(movieId);
    });
  }

  getDetail(id: number) {
    this.isLoading.set(true);
    this.#dataService
      .getMovieDetail(id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          this.#movieService.setSelectedMovie(data);
          this.movie$ = this.#movieService.selectedMovie();
        },
        error: (err) => console.error(err),
        complete: () => this.#cd.detectChanges(),
      });
  }

  getSimilar(id: number) {
    this.#dataService
      .getSimilarMovies(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => this.#movieService.setSimilarMovies(data.results),
        error: (err) => console.error(err),
        complete: () => this.#cd.detectChanges(),
      });
  }

  onImageError(poster_path: string) {
    console.warn(`${poster_path} image not able to loaded`);
  }
}
