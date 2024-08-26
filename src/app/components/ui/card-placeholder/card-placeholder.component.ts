import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-card-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './card-placeholder.component.html',
  styleUrl: './card-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPlaceholderComponent {}
