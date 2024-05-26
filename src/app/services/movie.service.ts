import { Injectable, WritableSignal, signal } from '@angular/core';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  public movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  public selectedMovie: WritableSignal<Movie> = signal<Movie>();

  setMovies(data: Movie[]) {
    // Create a Set to keep track of unique movie IDs
    const uniqueMovieIds = new Set(
      this.movies().map((movie: Movie) => movie.id)
    );

    // Filter out duplicates by checking if the movie ID is already in the Set
    const uniqueMovies = data.filter(
      (movie: Movie) => !uniqueMovieIds.has(movie.id)
    );

    this.movies.update((items) => [...items, ...uniqueMovies]);
  }

  setSelectedMovie(values: Movie) {
    this.selectedMovie.set(values);
  }
}
