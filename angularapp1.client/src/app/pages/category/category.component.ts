import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, Filters, Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  standalone: false,
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit, OnDestroy {
  name = '';
  category?: Category;
  products: Product[] = [];
  more: Product[] = [];
  categories: string[] = [];
  metals: string[] = ['All'];
  priceMax = 0;
  f: Filters = { query: '', metal: 'All', sort: 'default', maxPrice: 0, category: 'All' };

  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProductService
  ) { }

  ngOnInit(): void {
    this.categories = this.service.getCategories();
    this.sub = this.route.paramMap.subscribe(params => {
      this.name = params.get('name') ?? '';
      this.category = this.service.categoryByName(this.name);
      this.products = this.service.getByCategory(this.name);
      this.more = this.service.getMore(this.name, 4);
      this.metals = this.service.metalsOf(this.products);
      this.priceMax = this.service.priceMaxOf(this.products);
      this.reset();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get filtered(): Product[] {
    return this.service.applyFilters(this.products, this.f);
  }

  // Panel me doosri category par click = us category ka page
  pick(category: string): void {
    if (category === 'All') {
      this.router.navigate(['/products']);
    } else {
      this.router.navigate(['/category', category]);
    }
  }

  reset(): void {
    this.f = { query: '', metal: 'All', sort: 'default', maxPrice: this.priceMax, category: 'All' };
  }

  onImgError(): void {
    if (this.category) this.category.image = '';
  }
}
