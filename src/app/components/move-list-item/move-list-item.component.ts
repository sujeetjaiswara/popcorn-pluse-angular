import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-move-list-item',
  standalone: true,
  imports: [JsonPipe, RouterLink, NgOptimizedImage],
  templateUrl: './move-list-item.component.html',
  styleUrl: './move-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveListItemComponent {
  movie = input<Movie>();

  getPoster(posterPath: any) {
    return `https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`;
  }

  // getRating(vote_average: number) {
  //   return Math.floor(vote_average);
  // }
}
