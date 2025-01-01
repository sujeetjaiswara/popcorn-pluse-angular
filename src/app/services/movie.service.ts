import { Injectable, signal } from '@angular/core';
import { Movie } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  #movies = signal<Movie[]>([]);
  #selectedMovie = signal<Movie | null>(null);
  #similarMovies = signal<Movie[]>([]);
  #searchTerm = signal<string>('');
  #isLoading = signal<boolean>(false);
  #isLoadingMore = signal<boolean>(false);

  // Getters
  readonly movies = this.#movies.asReadonly();
  readonly selectedMovie = this.#selectedMovie.asReadonly();
  readonly similarMovies = this.#similarMovies.asReadonly();
  readonly searchTerm = this.#searchTerm.asReadonly();
  readonly isLoading = this.#isLoading.asReadonly();
  readonly isLoadingMore = this.#isLoadingMore.asReadonly();

  setIsLoading(value: boolean) {
    this.#isLoading.set(value);
  }

  setIsLoadingMore(value: boolean) {
    this.#isLoadingMore.set(value);
  }

  setMovies(data: Movie[]) {
    const uniqueMovieIds = new Set(this.#movies().map((movie: Movie) => movie.id));
    const uniqueMovies = data.filter((movie: Movie) => !uniqueMovieIds.has(movie.id));
    this.#movies.update((items) => [...items, ...uniqueMovies]);
  }

  setSelectedMovie(values: Movie) {
    this.#selectedMovie.set(values);
  }

  setSimilarMovies(data: Movie[]) {
    this.#similarMovies.set([...data]);
  }

  setSearchTerm(term: string) {
    this.#searchTerm.set(term);
  }

  resetMovieData() {
    this.#movies.set([]);
  }
}
