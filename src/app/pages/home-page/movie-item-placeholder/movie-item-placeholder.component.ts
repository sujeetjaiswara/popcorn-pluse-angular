import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardPlaceholderComponent } from '../../../components/ui/card-placeholder/card-placeholder.component';

@Component({
  selector: 'app-movie-item-placeholder',
  imports: [CardPlaceholderComponent],
  templateUrl: './movie-item-placeholder.component.html',
  styleUrl: './movie-item-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieItemPlaceholderComponent {}
