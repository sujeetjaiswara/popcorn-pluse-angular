import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-move-list-item',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './move-list-item.component.html',
  styleUrl: './move-list-item.component.scss',
})
export class MoveListItemComponent {
  movie = input<Movie>();

  getPoster(posterPath: any) {
    return `https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`;
  }
}
