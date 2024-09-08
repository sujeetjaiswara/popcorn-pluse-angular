import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  #http = inject(HttpClient);
  #API = environment.PUBLIC_ENDPOINT;
  #KEY = environment.PUBLIC_API_KEY;
  #LANG = 'en-IN'; //'hi-IN';
  #REGION = 'IN';
  #INCLUDE_ADULT = false;

  getMovieByCategory(selectedCategory: string, page: number) {
    let url = `${this.#API}/movie/${selectedCategory}?api_key=${this.#KEY}`;
    url += `&language=${this.#LANG}`;
    url += `&region=${this.#REGION}`;
    url += `&include_adult=${this.#INCLUDE_ADULT}`;
    url += `&page=${page}`;
    return this.#http.get(url);
  }

  searchMovie(searchTerm: string, page: number) {
    let url = `${this.#API}/search/movie?query=${searchTerm}`;
    url += `&include_adult=${this.#INCLUDE_ADULT}`;
    url += `&language=${this.#LANG}`;
    url += `&region=${this.#REGION}`;
    url += `&api_key=${this.#KEY}`;
    url += `&page=${page}`;
    return this.#http.get(url);
  }

  getMovieDetail(id: number) {
    const apiUrl = `${this.#API}/movie/${id}?api_key=${this.#KEY}&language=${this.#LANG}&region=${this.#REGION}`;
    return this.#http.get(apiUrl);
  }

  getSimilarMovies(id: number) {
    const apiUrl = `${this.#API}/movie/${id}/similar?api_key=${this.#KEY}&language=${this.#LANG}&region=${this.#REGION}`;
    return this.#http.get(apiUrl);
  }

  getWatchProviders(id: number) {
    const apiUrl = `${this.#API}/movie/${id}/watch/providers?api_key=${this.#KEY}&language=${this.#LANG}&region=${this.#REGION}`;
    this.#http.get(apiUrl);
  }
}
