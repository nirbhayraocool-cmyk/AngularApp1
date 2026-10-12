import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filters } from '../../models/product';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  standalone: false,
  styleUrl: './filter-panel.component.css'
})
export class FilterPanelComponent {
  @Input({ required: true }) f!: Filters;
  @Input() categories: string[] = [];
  @Input() selectedCategory = 'All';
  @Input() metals: string[] = [];
  @Input() priceMax = 0;

  @Output() categoryPick = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  open = false;   // mobile par panel khula hai ya nahi

  get active(): number {
    let n = 0;
    if (this.f.query.trim()) n++;
    if (this.f.metal !== 'All') n++;
  
    if (this.f.maxPrice < this.priceMax) n++;
    return n;
  }
}
