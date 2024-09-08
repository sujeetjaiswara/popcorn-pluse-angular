import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movie-detail-shimmer',
  standalone: true,
  imports: [],
  templateUrl: './movie-detail-shimmer.component.html',
  styleUrl: './movie-detail-shimmer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetailShimmerComponent {

}
