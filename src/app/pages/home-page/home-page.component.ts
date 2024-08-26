import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  WritableSignal,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { FilterInputComponent, MoveListItemComponent, SearchInputComponent } from '../../components';
import { DataNotFoundComponent } from '../../components/data-not-found/data-not-found.component';
import { ButtonComponent, CardPlaceholderComponent, SpinnerComponent } from '../../components/ui';
import { Category, Movie } from '../../models';
import { DataService, MovieService } from '../../services';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    SearchInputComponent,
    FilterInputComponent,
    MoveListItemComponent,
    SpinnerComponent,
    ButtonComponent,
    CardPlaceholderComponent,
    DataNotFoundComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  #dataService = inject(DataService);
  #movieService = inject(MovieService);
  #destroy: DestroyRef = inject(DestroyRef);
  #selectedCategory = signal<string>('popular');
  #page = signal<number>(1);
  #searchTerm = signal<string>('');

  movies: Movie[] = [];
  isLoading = false;
  isLoadingMore = false;

  private cd = inject(ChangeDetectorRef);

  categories: WritableSignal<Category[]> = signal([
    {value: 'popular', name: 'Popular'},
    {value: 'top_rated', name: 'Top Rated'},
    {value: 'now_playing', name: 'Now Playing'},
    {value: 'upcoming', name: 'Upcoming'},
  ]);

  constructor() {
    // TODO: Refector this code
    if (this.#movieService.movies().length === 0) {
      this.#movieService.setIsLoading(true);
    }

    afterNextRender(() => {
      console.log('🚀afterNextRender() called.');

      if (this.#movieService.movies().length > 0) {
        this.movies = this.#movieService.movies();
        this.cd.markForCheck();
        return;
      }

      this.getMovieByCategory();
    });

    effect(() => {
      console.log('🚦isLoading effect() called.');
      this.isLoading = this.#movieService.isLoading();
      this.cd.markForCheck();
    });

    effect(() => {
      console.log('🚦isLoadingMore effect() called.');
      this.isLoadingMore = this.#movieService.isLoadingMore();
      this.cd.markForCheck();
    });

    effect(() => {
      console.log('🚦movies effect() called.');
      this.movies = this.#movieService.movies();
      this.cd.markForCheck();
    });
  }

  getMovieByCategory() {
    this.#movieService.setIsLoading(true);
    this.#dataService
      .getMovieByCategory(this.#selectedCategory(), this.#page())
      .pipe(
        finalize(() => {
          this.#movieService.setIsLoadingMore(false);
          this.#movieService.setIsLoading(false);
        }),
        takeUntilDestroyed(this.#destroy),
      )
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => this.#movieService.setMovies(data.results),
        error: (err) => console.error(err),
        complete: () => console.info('✅getMovieByCategory() complete'),
      });
  }

  filterMovies(value: string) {
    this.#selectedCategory.set(value);
    this.#movieService.resetMovieData();
    this.getMovieByCategory();
  }

  searchMovie() {
    this.#page.set(1);
    if (this.#searchTerm()) {
      this.#dataService
        .searchMovie(this.#searchTerm(), this.#page())
        .pipe(takeUntilDestroyed(this.#destroy))
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (data: any) => {
            this.#movieService.resetMovieData();
            this.#movieService.setMovies(data.results);
          },
          error: (err) => console.error('Error:', err),
          complete: () => console.info('searchMovie() complete'),
        });
    } else {
      this.getMovieByCategory();
    }
  }

  loadMore() {
    this.#page.set(this.#page() + 1);
    this.#movieService.setIsLoadingMore(true);
    this.getMovieByCategory();
  }
}
