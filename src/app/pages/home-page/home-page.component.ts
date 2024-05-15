import { JsonPipe } from '@angular/common';
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterInputComponent } from '../../components/filter-input/filter-input.component';
import { MoveListItemComponent } from '../../components/move-list-item/move-list-item.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { Category } from '../../interfaces/category';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    SearchInputComponent,
    FilterInputComponent,
    MoveListItemComponent,
    JsonPipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  PUBLIC_ENDPOINT = 'https://api.themoviedb.org/3';
  PUBLIC_API_KEY = '70341816ef426fc937b20d6588bd9773';

  public movies: WritableSignal<Movie[]> = signal([]);

  public selectedCategory = 'popular';

  public page = 1;
  public searchTerm = '';
  public isLoading = false;
  public isLoadingMore = false;

  public categories: WritableSignal<Category[]> = signal([
    { value: 'popular', name: 'Popular' },
    { value: 'top_rated', name: 'Top Rated' },
    { value: 'now_playing', name: 'Now Playing' },
    { value: 'upcoming', name: 'Upcoming' },
  ]);

  ngOnInit() {
    console.log('ngOnInit() called.');
    this.getMovieByCategory();
  }

  async getMovieByCategory() {
    this.isLoading = true;

    const apiUrl = `${this.PUBLIC_ENDPOINT}/movie/${this.selectedCategory}?api_key=${this.PUBLIC_API_KEY}&page=${this.page}`;

    return fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Create a Set to keep track of unique movie IDs
        const uniqueMovieIds = new Set(
          this.movies().map((movie: any) => movie.id)
        );

        // Filter out duplicates by checking if the movie ID is already in the Set
        const uniqueMovies = data.results.filter(
          (movie: any) => !uniqueMovieIds.has(movie.id)
        );

        // Concatenate unique movies to the existing movies array
        this.movies.set([...this.movies(), ...uniqueMovies]);

        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error:', error);
        this.isLoading = false;
      });
  }

  async loadMore() {
    this.page = this.page + 1;
    this.isLoadingMore = true;
    await this.getMovieByCategory();
    this.isLoadingMore = false;
  }

  filterMovies(value: string) {
    this.selectedCategory = value;
    this.movies.set([]);
    this.getMovieByCategory();
  }

  searchMovie() {
    this.page = 1;
    if (this.searchTerm) {
      const apiUrl = `${this.PUBLIC_ENDPOINT}/search/collection?query=${this.searchTerm}&include_adult=false&language=en-US&api_key=${this.PUBLIC_API_KEY}&page=${this.page}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          this.movies.set(data.results);
        })
        .catch((error) => console.error('Error:', error));
    } else {
      this.getMovieByCategory();
    }
  }
}
