import { afterNextRender, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { DropdownInterface, DropdownOptions, InstanceOptions } from 'flowbite';
import { Dropdown } from 'flowbite';
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
  dropdown!: DropdownInterface;

  constructor() {
    afterNextRender(() => {
      const $targetEl: HTMLElement | null = document.getElementById('dropdownDots');
      const $triggerEl: HTMLElement | null = document.getElementById('dropdownMenuIconButton');

      const options: DropdownOptions = {
        placement: 'bottom',
        triggerType: 'click',
        offsetSkidding: 0, // X horizontal axis
        offsetDistance: 4, // Y horizontal axis
        delay: 100,
        onHide: () => {
          console.log('dropdown has been hidden');
        },
        onShow: () => {
          console.log('dropdown has been shown');
        },
        onToggle: () => {
          console.log('dropdown has been toggled');
        },
      };

      // instance options object
      const instanceOptions: InstanceOptions = {
        id: 'dropdownMenu',
        override: true,
      };

      this.dropdown = new Dropdown($targetEl, $triggerEl, options, instanceOptions);
    });
  }

  onSelectCategory(e: Event, value: string) {
    e.stopPropagation();
    this.dropdown.hide();
    this.selectedCategory.emit(value);
  }
}
