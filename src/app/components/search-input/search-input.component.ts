import { ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  serachTerm = output<string>();
  #movieService = inject(MovieService);
  query = '';

  constructor() {
    effect(() => {
      this.query = this.#movieService.searchTerm();
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.#movieService.setSearchTerm(this.query);
      this.serachTerm.emit(this.query);
    }
  }
}
