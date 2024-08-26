import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data-not-found',
  standalone: true,
  imports: [],
  templateUrl: './data-not-found.component.html',
  styleUrl: './data-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataNotFoundComponent {

}
