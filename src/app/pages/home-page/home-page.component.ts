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
import {
  FilterInputComponent,
  MoveListItemComponent,
  SearchInputComponent,
} from '../../components';
import { DataNotFoundComponent } from '../../components/data-not-found/data-not-found.component';
import { ButtonComponent, CardPlaceholderComponent, SpinnerComponent } from '../../components/ui';
import { Category, Movie } from '../../models';
import { DataService, MovieService } from '../../services';

@Component({
  selector: 'app-home-page',
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
  #cd = inject(ChangeDetectorRef);
  #selectedCategory = signal<string>('popular');
  #page = signal<number>(1);
  movies: Movie[] = [];
  isLoading = false;
  isLoadingMore = false;
  searchTerm = '';

  categories: WritableSignal<Category[]> = signal([
    { value: 'popular', name: 'Popular' },
    { value: 'top_rated', name: 'Top Rated' },
    { value: 'now_playing', name: 'Now Playing' },
    { value: 'upcoming', name: 'Upcoming' },
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
        this.#cd.markForCheck();
        return;
      }

      this.getMovieByCategory();
    });

    effect(() => {
      console.log('🚦isLoading effect() called.');
      this.isLoading = this.#movieService.isLoading();
      this.#cd.markForCheck();
    });

    effect(() => {
      console.log('🚦isLoadingMore effect() called.');
      this.isLoadingMore = this.#movieService.isLoadingMore();
      this.#cd.markForCheck();
    });

    effect(() => {
      console.log('🚦movies effect() called.');
      this.movies = this.#movieService.movies();
      this.#cd.markForCheck();
    });
  }

  getMovieByCategory() {
    this.searchTerm = '';
    this.#movieService.setSearchTerm('');
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
      });
  }

  filterMovies(value: string) {
    this.#selectedCategory.set(value);
    this.#movieService.resetMovieData();
    this.getMovieByCategory();
  }

  onSearchMovie(searchTerm: string) {
    this.#movieService.resetMovieData();
    this.#page.set(1);
    this.searchTerm = searchTerm;
    this.searchMovie(this.searchTerm);
  }

  searchMovie(searchTerm: string) {
    if (searchTerm) {
      this.#dataService
        .searchMovie(searchTerm, this.#page())
        .pipe(
          finalize(() => {
            this.#movieService.setIsLoadingMore(false);
          }),
          takeUntilDestroyed(this.#destroy),
        )
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (data: any) => {
            this.#movieService.setMovies(data.results);
          },
          error: (err) => {
            console.error(err);
          },
        });
    } else {
      this.#movieService.resetMovieData();
      this.#selectedCategory.set('popular');
      this.getMovieByCategory();
    }
  }

  loadMore() {
    this.#page.set(this.#page() + 1);
    this.#movieService.setIsLoadingMore(true);

    if (this.searchTerm) {
      this.searchMovie(this.searchTerm);
    } else {
      this.getMovieByCategory();
    }
  }
}
