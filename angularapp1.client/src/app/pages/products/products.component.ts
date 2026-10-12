import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Filters, Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: false,
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  all: Product[];
  categories: string[];
  metals: string[];
  priceMax: number;
  f: Filters;
  private sub?: Subscription;

  constructor(
    private service: ProductService,
    private route: ActivatedRoute,
    public wishlist: WishlistService
  ) {
    this.all = service.getAll();
    this.categories = [...service.getCategories(), 'Saved'];
    this.metals = service.metalsOf(this.all);
    this.priceMax = service.priceMaxOf(this.all);
    this.f = this.blank();
  }

  ngOnInit(): void {
    // /products?cat=Saved se seedha Saved wala view khule
    this.sub = this.route.queryParamMap.subscribe(params => {
      const c = params.get('cat');
      this.f.category = c && this.categories.includes(c) ? c : 'All';
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get filtered(): Product[] {
    if (this.f.category === 'Saved') {
      const saved = this.all.filter(p => this.wishlist.has(p.id));
      return this.service.applyFilters(saved, { ...this.f, category: 'All' });
    }
    return this.service.applyFilters(this.all, this.f);
  }

  get baseCount(): number {
    return this.f.category === 'Saved' ? this.wishlist.count() : this.all.length;
  }

  pick(category: string): void {
    this.f.category = category;
  }

  reset(): void {
    this.f = this.blank();
  }

  shareSaved(): void {
    const items = this.all.filter(p => this.wishlist.has(p.id));
    if (!items.length) return;
    const lines = items
      .map((p, i) => `${i + 1}. ${p.name} (${p.weight} g) - ₹${p.price.toLocaleString('en-IN')}`)
      .join('\n');
    const text = `Hello DS Jewellers, I like these designs:\n${lines}`;
    window.open('https://wa.me/918874196809?text=' + encodeURIComponent(text), '_blank');
  }

  private blank(): Filters {
    return { query: '', metal: 'All', sort: 'default', maxPrice: this.priceMax, category: 'All' };
  }
}
