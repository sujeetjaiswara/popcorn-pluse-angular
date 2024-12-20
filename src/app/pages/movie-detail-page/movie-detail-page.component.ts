import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { MovieDetailComponent } from '../../components';
import { MoveListItemComponent } from '../../components/move-list-item/move-list-item.component';
import { CardPlaceholderComponent } from '../../components/ui/card-placeholder/card-placeholder.component';
import { Movie } from '../../models';
import { DataService, MovieService } from '../../services';
import { MovieDetailShimmerComponent } from './movie-detail-shimmer/movie-detail-shimmer.component';

@Component({
  selector: 'app-movie-detail-page',
  imports: [
    MovieDetailComponent,
    MovieDetailShimmerComponent,
    MoveListItemComponent,
    CardPlaceholderComponent,
  ],
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
  similarMovies$!: Movie[] | null;
  isLoading = signal(true);
  isLoadingSimilarMovies = signal(true);

  constructor() {
    afterNextRender(() => {
      this.#route.params.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((params) => {
        const movieId = Number(params['id']);
        this.getDetail(movieId);
        this.getSimilar(movieId);
      });
    });

    effect(() => {
      this.movie$ = this.#movieService.selectedMovie();
    });

    effect(() => {
      this.similarMovies$ = this.#movieService.similarMovies();
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
        next: (data: any) => {
          this.#movieService.setSelectedMovie(data);
        },
        error: (err) => console.error(err),
      });
  }

  getSimilar(id: number) {
    this.isLoadingSimilarMovies.set(true);
    this.#dataService
      .getSimilarMovies(id)
      .pipe(
        finalize(() => {
          this.isLoadingSimilarMovies.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
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
