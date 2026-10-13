import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

interface Form {
  id: number;
  name: string;
  category: string;
  metal: string;
  weight: number | null;
  price: number | null;
  symbol: string;
  image: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: false,
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  categories: string[];
  symbols = ['ring', 'necklace', 'earring', 'bangle', 'diamond', 'pendant'];
  metals = ['22K Gold', '24K Gold', '18K Gold', 'Diamond', 'Silver', 'Platinum'];

  query = '';
  catFilter = 'All';

  formOpen = false;
  editing = false;
  form: Form = this.blank();
  errors: string[] = [];
  badImg = false;
  busy = false;
  uploading = false;

  deleting?: Product;
  toast = '';
  private toastTimer: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private service: ProductService
  ) {
    this.categories = service.categories.map(c => c.name);
  }

  // ---------- List ----------
  get products(): Product[] { return this.service.getAll(); }

  get filtered(): Product[] {
    const q = this.query.trim().toLowerCase();
    return this.products
      .filter(p => (this.catFilter === 'All' || p.category === this.catFilter) &&
        (!q || p.name.toLowerCase().includes(q)))
      .sort((a, b) => b.id - a.id);
  }

  get usedCategories(): number { return new Set(this.products.map(p => p.category)).size; }
  get highest(): number { return this.products.length ? Math.max(...this.products.map(p => p.price)) : 0; }

  // ---------- Form ----------
  openAdd(): void {
    this.form = this.blank();
    this.editing = false;
    this.errors = [];
    this.badImg = false;
    this.formOpen = true;
  }

  openEdit(p: Product): void {
    this.form = {
      id: p.id, name: p.name, category: p.category, metal: p.metal,
      weight: p.weight, price: p.price, symbol: p.symbol, image: p.image ?? ''
    };
    this.editing = true;
    this.errors = [];
    this.badImg = false;
    this.formOpen = true;
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.formOpen = false;
    this.deleting = undefined;
  }

  onCategory(name: string): void {
    this.form.category = name;
    const cat = this.service.categoryByName(name);
    if (cat) this.form.symbol = cat.symbol;   // category ke hisaab se drawing apne aap chun lo
  }

  setNumber(field: 'weight' | 'price', e: Event): void {
    const v = (e.target as HTMLInputElement).valueAsNumber;
    this.form[field] = Number.isNaN(v) ? null : v;
  }

  async save(e: Event): Promise<void> {
    e.preventDefault();
    const f = this.form;
    const errs: string[] = [];
    if (!f.name.trim()) errs.push('Name is required.');
    if (!f.category) errs.push('Please choose a category.');
    if (!f.metal.trim()) errs.push('Metal is required.');
    if (!(f.weight && f.weight > 0)) errs.push('Weight must be more than 0.');
    if (!(f.price && f.price > 0)) errs.push('Price must be more than 0.');
    const img = f.image.trim();
    if (img && !/^(https?:\/\/|\/|images\/|assets\/)/i.test(img)) {
      errs.push('Photo must be a full link (https://...) or a site path like images/ring.jpg.');
    }
    this.errors = errs;
    if (errs.length) return;

    const product: Product = {
      id: f.id,
      name: f.name.trim(),
      category: f.category,
      metal: f.metal.trim(),
      weight: f.weight!,
      price: f.price!,
      symbol: f.symbol,
      image: img || undefined
    };

    const wasEditing = this.editing;
    this.busy = true;
    try {
      if (wasEditing) await this.service.update(product);
      else await this.service.add(product);
      this.formOpen = false;
      this.say(wasEditing ? 'Product updated' : 'Product added');
    } catch (err) {
      const status = (err as HttpErrorResponse).status;
      this.errors = [status === 401 ? 'Your session has expired. Please sign in again.'
        : status === 400 ? 'The server did not accept this data. Please check the fields.'
          : 'Could not save. Please try again.'];
    } finally {
      this.busy = false;
    }
  }

  // ---------- Delete ----------
  askDelete(p: Product): void { this.deleting = p; }

  async confirmDelete(): Promise<void> {
    if (!this.deleting) return;
    this.busy = true;
    try {
      await this.service.remove(this.deleting.id);
      this.say('Product deleted');
    } catch {
      this.say('Could not delete. Please try again.');
    } finally {
      this.busy = false;
      this.deleting = undefined;
    }
  }
  // ---------- Photo upload ----------
  async onFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';                       // wahi photo dobara chunne par bhi chale
    if (!file) return;

    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      this.errors = ['Please choose a JPG, PNG or WEBP photo.'];
      return;
    }

    this.uploading = true;
    this.errors = [];
    try {
      const small = await this.shrink(file);
      this.form.image = await this.service.uploadImage(small);
      this.badImg = false;
    } catch (err) {
      const res = err as HttpErrorResponse;
      this.errors = [
        res.status === 401 ? 'Your session has expired. Please sign in again.'
          : res.status === 400 ? (res.error?.message ?? 'This photo was not accepted.')
            : res.status === 413 ? 'Photo is too large.'
              : 'Upload failed. Please try again.'
      ];
    } finally {
      this.uploading = false;
    }
  }

  // Badi photo ko chhota (max 1600px, JPG) karke bhejo: tez upload aur tez site
  private async shrink(file: File): Promise<File> {
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const w = Math.round(bmp.width * scale);
      const h = Math.round(bmp.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(bmp, 0, 0, w, h);
      bmp.close();
      const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.85));
      return blob ? new File([blob], 'photo.jpg', { type: 'image/jpeg' }) : file;
    } catch {
      return file;
    }
  }
  // ---------- Misc ----------
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  private say(msg: string): void {
    this.toast = msg;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 2600);
  }

  private blank(): Form {
    return { id: 0, name: '', category: '', metal: '22K Gold', weight: null, price: null, symbol: 'ring', image: '' };
  }
}
