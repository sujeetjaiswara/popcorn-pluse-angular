import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterInputComponent {
  categories = input<Category[]>();
  selectedCategory = output<string>();

  onSelectCategory(args: any) {
    console.log(args.target.value);
    this.selectedCategory.emit(args.target.value);
  }
}
