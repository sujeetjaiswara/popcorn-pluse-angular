import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private API_KEY = environment.PUBLIC_API_KEY;
  private END_POINT = environment.PUBLIC_ENDPOINT;
  private readonly http = inject(HttpClient);

  getMovieByCategory(selectedCategory: string, page: number) {
    const apiUrl = `${this.END_POINT}/movie/${selectedCategory}?api_key=${this.API_KEY}&include_adult=false&include_video=false&language=en-US&page=${page}`;
    return this.http.get(apiUrl);
  }

  searchMovie(searchTerm: string, page: number) {
    const apiUrl = `${this.END_POINT}/search/collection?query=${searchTerm}&include_adult=false&language=en-US&api_key=${this.API_KEY}&page=${page}`;
    return this.http.get(apiUrl);
  }

  getMovieDetail(id: number) {
    return this.http.get(
      `${this.END_POINT}/movie/${id}?api_key=${this.API_KEY}`
    );
  }

  getSimilarMovies(id: number) {
    return this.http.get(
      `${this.END_POINT}/movie/${id}/similar?api_key=${this.API_KEY}`
    );
  }

  getWatchProviders(id: number) {
    this.http.get(
      `${this.END_POINT}/movie/${id}/watch/providers?api_key=${this.API_KEY}`
    );
  }
}
