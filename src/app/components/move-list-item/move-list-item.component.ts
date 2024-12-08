import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models';

@Component({
  selector: 'app-move-list-item',
  imports: [RouterLink, NgOptimizedImage, DecimalPipe],
  templateUrl: './move-list-item.component.html',
  styleUrl: './move-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveListItemComponent {
  movie = input.required<Movie>();

  getPoster = computed(() => {
    return `https://image.tmdb.org/t/p/w220_and_h330_face${this.movie()?.poster_path}`;
  });
}
