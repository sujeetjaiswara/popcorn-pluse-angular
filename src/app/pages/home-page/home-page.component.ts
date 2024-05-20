import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  WritableSignal,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { FilterInputComponent } from '../../components/filter-input/filter-input.component';
import { MoveListItemComponent } from '../../components/move-list-item/move-list-item.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { Category } from '../../interfaces/category';
import { Movie } from '../../interfaces/movie';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    JsonPipe,
    SearchInputComponent,
    FilterInputComponent,
    MoveListItemComponent,
    SpinnerComponent,
    ButtonComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private dataService = inject(DataService);
  private readonly destroy: DestroyRef = inject(DestroyRef);
  public movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  public selectedCategory = signal<string>('popular');
  public page = signal<number>(1);
  public searchTerm = signal<string>('');
  public isLoading = signal<boolean>(false);
  public isLoadingMore = signal<boolean>(false);

  public categories: WritableSignal<Category[]> = signal([
    { value: 'popular', name: 'Popular' },
    { value: 'top_rated', name: 'Top Rated' },
    { value: 'now_playing', name: 'Now Playing' },
    { value: 'upcoming', name: 'Upcoming' },
  ]);

  constructor(private cd: ChangeDetectorRef) {
    afterNextRender(() => {
      console.log('🚀afterNextRender() called.');
      this.getMovieByCategory();
    });
  }

  getMovieByCategory() {
    console.log('getMovieByCategory() called.');
    this.isLoading.set(true);
    this.dataService
      .getMovieByCategory(this.selectedCategory(), this.page())
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (data: any) => {
          // Create a Set to keep track of unique movie IDs
          const uniqueMovieIds = new Set(
            this.movies().map((movie: Movie) => movie.id)
          );

          // Filter out duplicates by checking if the movie ID is already in the Set
          const uniqueMovies = data.results.filter(
            (movie: Movie) => !uniqueMovieIds.has(movie.id)
          );

          // Concatenate unique movies to the existing movies array
          this.movies.set([...this.movies(), ...uniqueMovies]);
        },
        error: (err) => console.error(err),
        complete: () => this.isLoading.set(false),
      });
  }

  filterMovies(value: string) {
    this.selectedCategory.set(value);
    this.movies.set([]);
    this.getMovieByCategory();
  }

  searchMovie() {
    this.page.set(1);
    if (this.searchTerm) {
      this.dataService
        .searchMovie(this.searchTerm(), this.page())
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data: any) => this.movies.set(data.results),
          error: (err) => console.error('Error:', err),
          complete: () => console.info('complete'),
        });
    } else {
      this.getMovieByCategory();
    }
  }

  loadMore() {
    this.page.set(this.page() + 1);
    this.isLoadingMore.set(true);
    this.getMovieByCategory();
    this.isLoadingMore.set(false);
  }
}
