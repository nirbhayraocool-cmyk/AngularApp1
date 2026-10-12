import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  showTop = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop = window.scrollY > 400;
  }

  toTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
