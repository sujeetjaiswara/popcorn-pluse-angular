import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);

  getMovieByCategory(selectedCategory: string, page: number) {
    const apiUrl = `${environment.PUBLIC_ENDPOINT}/movie/${selectedCategory}?api_key=${environment.PUBLIC_API_KEY}&include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
    return this.http.get(apiUrl);
  }

  searchMovie(searchTerm: string, page: number) {
    const apiUrl = `${environment.PUBLIC_ENDPOINT}/search/collection?query=${searchTerm}&include_adult=false&language=en-US&api_key=${environment.PUBLIC_API_KEY}&page=${page}`;
    return this.http.get(apiUrl);
  }
}
