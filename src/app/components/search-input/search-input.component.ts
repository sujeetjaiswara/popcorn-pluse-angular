import { ChangeDetectionStrategy, Component, effect, inject, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {
  serachTerm = output<string>();
  #movieService = inject(MovieService);
  #searchText$ = new Subject<string>();
  query = '';

  constructor() {
    effect(() => {
      this.query = this.#movieService.searchTerm();
    });
  }

  ngOnInit() {
    this.#searchText$.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchTerm) => {
      this.#movieService.setSearchTerm(this.query);
      this.serachTerm.emit(searchTerm);
    });
  }

  onSearch() {
    this.#searchText$.next(this.query);
  }
}
