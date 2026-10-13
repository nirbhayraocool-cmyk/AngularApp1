import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Category, Filters, Product } from '../models/product';


@Injectable({ providedIn: 'root' })
export class ProductService {
  readonly categories: Category[] = [
    { name: 'Rings', symbol: 'ring', a: '#8c1d36', b: '#3d0914', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Necklaces', symbol: 'necklace', a: '#8a5a14', b: '#2a1204', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Earrings', symbol: 'earring', a: '#4a1a5c', b: '#1c0a28', image: 'https://images.unsplash.com/photo-1652766540048-de0a878a3266?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Bangles', symbol: 'bangle', a: '#12766d', b: '#062a2a', image: 'https://images.unsplash.com/photo-1583878543723-dcd6ad8bcb3f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Diamonds', symbol: 'diamond', a: '#1c3a7a', b: '#0b1430', image: 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Pendants', symbol: 'pendant', a: '#7a1f4f', b: '#2a0a1c', image: 'https://plus.unsplash.com/premium_photo-1681276170092-446cd1b5b32d?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Chains', symbol: 'necklace', a: '#7a5a14', b: '#241604', image: 'https://plus.unsplash.com/premium_photo-1709033404514-c3953af680b4?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Mangalsutra', symbol: 'pendant', a: '#8c1d36', b: '#2a0610', image: 'https://images.unsplash.com/photo-1777126413461-26387cfe5ce5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Bracelets', symbol: 'bangle', a: '#2f4a7a', b: '#0b1226', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Anklets', symbol: 'bangle', a: '#5a3a7a', b: '#190d26', image: 'https://images.unsplash.com/photo-1588658163621-f853df4bbe86?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
  ];

  // Sample data: naam, weight, price aur photo apne hisaab se badal lena
  private products: Product[] = [
    { id: 1, name: 'Royal Gold Ring', category: 'Rings', metal: '22K Gold', weight: 5.5, price: 32000, symbol: 'ring', image: 'https://images.unsplash.com/photo-1720093601709-66ce9c0068a1?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, name: 'Diamond Ring', category: 'Diamonds', metal: 'Diamond', weight: 4.2, price: 58000, symbol: 'ring', image: 'https://images.unsplash.com/photo-1613945407943-59cd755fd69e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, name: 'Bridal Necklace Set', category: 'Necklaces', metal: '22K Gold', weight: 38, price: 245000, symbol: 'necklace', image: 'https://images.unsplash.com/photo-1633934542430-0905ccb5f050?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'Temple Design Haar', category: 'Necklaces', metal: '22K Gold', weight: 25, price: 168000, symbol: 'necklace', image: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 5, name: 'Jhumka Earrings', category: 'Earrings', metal: '22K Gold', weight: 8, price: 52000, symbol: 'earring', image: 'https://images.unsplash.com/photo-1652766540048-de0a878a3266?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 6, name: 'Diamond Studs', category: 'Diamonds', metal: 'Diamond', weight: 2.5, price: 36000, symbol: 'diamond', image: 'https://images.unsplash.com/photo-1784746829625-b50da7a9d364?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 7, name: ' Gold Bangles', category: 'Bangles', metal: '22K Gold', weight: 20, price: 135000, symbol: 'bangle', image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 8, name: ' Heart Pendant', category: 'Pendants', metal: '22K Gold', weight: 3.2, price: 18500, symbol: 'pendant', image: 'https://images.unsplash.com/photo-1631965004544-1762fc696476?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 9, name: ' Gold Chain', category: 'Chains', metal: '22K Gold', weight: 12, price: 78000, symbol: 'necklace', image:'https://plus.unsplash.com/premium_photo-1791236134580-64a839f62716?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { id: 10, name: 'Rope Design Chain', category: 'Chains', metal: '22K Gold', weight: 18, price: 118000, symbol: 'necklace', image:'https://images.unsplash.com/photo-1721807550979-6e662d370e92?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 11, name: ' Mangalsutra', category: 'Mangalsutra', metal: '22K Gold', weight: 16, price: 98000, symbol: 'pendant', image:'https://images.unsplash.com/photo-1787769499614-82cff7828942?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 12, name: ' Mangalsutra', category: 'Mangalsutra', metal: 'Diamond', weight: 9, price: 74000, symbol: 'pendant', image:'https://images.unsplash.com/photo-1583878543723-dcd6ad8bcb3f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { id: 13, name: 'Gold Link Bracelet', category: 'Bracelets', metal: '22K Gold', weight: 14, price: 92000, symbol: 'bangle', image:'https://images.unsplash.com/photo-1741071520904-37ef3c0fea09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z29sZCUyMGJyYWNlbGV0c3xlbnwwfHwwfHx8MA%3D%3D' },
    { id: 14, name: 'Charm Bracelet', category: 'Bracelets', metal: '22K Gold', weight: 10, price: 64000, symbol: 'bangle', image:'https://images.unsplash.com/photo-1786052337516-9fb23fcf36de?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 15, name: ' Payal Pair', category: 'Anklets', metal: 'Silver', weight: 45, price: 5200, symbol: 'bangle', image:'https://images.unsplash.com/photo-1599799045747-9dbfcfef6b97?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 16, name: 'Anklet with Bells', category: 'Anklets', metal: 'Silver', weight: 38, price: 4400, symbol: 'bangle', image:'https://images.unsplash.com/photo-1599799045647-84b0ef3b2abb?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
  ];

  constructor(private http: HttpClient) { }

  // Gehne database (API) se laao. API na chale to upar ke namune wale gehne dikhte rahenge.
  async load(): Promise<void> {
    try {
      const list = await firstValueFrom(this.http.get<Product[]>('/api/products'));
      this.products = list.map(p => ({ ...p, image: p.image || undefined }));
    } catch {
      // API band ho to purana ya namune wala data chalta rahega
    }
  }

  async add(p: Product): Promise<void> {
    await firstValueFrom(this.http.post<Product>('/api/products', this.toApi(p)));
    await this.load();
  }

  async update(p: Product): Promise<void> {
    await firstValueFrom(this.http.put<void>(`/api/products/${p.id}`, this.toApi(p)));
    await this.load();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`/api/products/${id}`));
    await this.load();
  }
  async uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append('file', file);
    const res = await firstValueFrom(this.http.post<{ url: string }>('/api/uploads', body));
    return res.url;
  }

  private toApi(p: Product) {
    return { ...p, image: p.image || null };
  }

  getAll(): Product[] { return this.products; }
  getFeatured(): Product[] { return this.products.slice(0, 4); }
  getCategories(): string[] { return ['All', ...this.categories.map(c => c.name)]; }
  colorsOf(category: string): Category | undefined {
    return this.categories.find(c => c.name === category);
  }
  getById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  categoryByName(name: string): Category | undefined {
    return this.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  }

  getByCategory(name: string): Product[] {
    return this.products.filter(p => p.category.toLowerCase() === name.toLowerCase());
  }

  // Doosri categories ke gehne ("You May Also Like" ke liye)
  getMore(category: string, count = 4): Product[] {
    return this.products.filter(p => p.category.toLowerCase() !== category.toLowerCase()).slice(0, count);
  }

  // Usi category ke baaki gehne pehle, phir doosre
  getRelated(product: Product, count = 4): Product[] {
    const same = this.products.filter(p => p.category === product.category && p.id !== product.id);
    const others = this.products.filter(p => p.category !== product.category);
    return [...same, ...others].slice(0, count);
  }
  applyFilters(list: Product[], f: Filters): Product[] {
    const q = f.query.trim().toLowerCase();
    const out = list.filter(p =>
      (f.category === 'All' || p.category === f.category) &&
      (f.metal === 'All' || p.metal === f.metal) &&
      p.price <= f.maxPrice &&
      p.name.toLowerCase().includes(q)
    );

    switch (f.sort) {
      case 'priceAsc': out.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': out.sort((a, b) => b.price - a.price); break;
      case 'weightAsc': out.sort((a, b) => a.weight - b.weight); break;
      case 'weightDesc': out.sort((a, b) => b.weight - a.weight); break;
    }
    return out;
  }

  metalsOf(list: Product[]): string[] {
    return ['All', ...new Set(list.map(p => p.metal))];
  }

  priceMaxOf(list: Product[]): number {
    return list.length ? Math.ceil(Math.max(...list.map(p => p.price)) / 1000) * 1000 : 0;
  }
}
