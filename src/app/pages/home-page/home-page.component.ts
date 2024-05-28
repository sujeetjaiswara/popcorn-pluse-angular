import { JsonPipe } from '@angular/common';
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
import { ButtonComponent } from '../../components/button/button.component';
import { CardPlaceholderComponent } from '../../components/card-placeholder/card-placeholder.component';
import { FilterInputComponent } from '../../components/filter-input/filter-input.component';
import { MoveListItemComponent } from '../../components/move-list-item/move-list-item.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { Category } from '../../interfaces/category';
import { DataService } from '../../services/data.service';
import { MovieService } from '../../services/movie.service';

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
    CardPlaceholderComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected dataService = inject(DataService);
  protected movieService = inject(MovieService);
  private destroy: DestroyRef = inject(DestroyRef);
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
    // TODO: Refector this code
    if (this.movieService.movies().length === 0) {
      this.isLoading.set(true);
    }

    afterNextRender(() => {
      console.log('🚀afterNextRender() called.');
      if (this.movieService.movies().length === 0) {
        this.getMovieByCategory();
      }
    });

    effect(() => {
      // console.log('movies:[]', this.movieService.movies());
    });
  }

  getMovieByCategory() {
    this.isLoading.set(true);
    this.dataService
      .getMovieByCategory(this.selectedCategory(), this.page())
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => this.movieService.setMovies(data.results),
        error: (err) => console.error(err),
        complete: () => {
          this.isLoadingMore.set(false);
          this.isLoading.set(false);
        },
      });
  }

  filterMovies(value: string) {
    this.selectedCategory.set(value);
    this.movieService.movies.set([]);
    this.getMovieByCategory();
  }

  searchMovie() {
    this.page.set(1);
    if (this.searchTerm) {
      this.dataService
        .searchMovie(this.searchTerm(), this.page())
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (data: any) => this.movieService.movies.set(data.results),
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
  }
}
