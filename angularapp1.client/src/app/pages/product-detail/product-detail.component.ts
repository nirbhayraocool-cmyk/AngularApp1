import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: false,
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: Product;
  colors?: Category;
  related: Product[] = [];
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
    public wishlist: WishlistService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      this.product = this.service.getById(Number(params.get('id')));
      if (this.product) {
        this.colors = this.service.colorsOf(this.product.category);
        this.related = this.service.getRelated(this.product, 4);
      } else {
        this.related = this.service.getAll().slice(0, 4);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get whatsappLink(): string {
    const text = `Hello DS Jewellers, I am interested in ${this.product?.name ?? 'your jewellery'}`;
    return 'https://wa.me/918874196809?text=' + encodeURIComponent(text);
  }

  onImgError(): void {
    if (this.product) this.product.image = undefined;
  }
}
