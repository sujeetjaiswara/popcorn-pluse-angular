import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Category } from '../../models';

@Component({
  selector: 'app-filter-input',
  imports: [],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterInputComponent {
  categories = input.required<Category[]>();
  selectedCategory = output<string>();

  onSelectCategory(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.selectedCategory.emit(value);
  }
}
