import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movie-detail-page',
  standalone: true,
  imports: [],
  templateUrl: './movie-detail-page.component.html',
  styleUrl: './movie-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailPageComponent {}
