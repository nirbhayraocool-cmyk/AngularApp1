import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Photo { src: string; label: string; }

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  standalone: false,
  styleUrl: './location.component.css'
})
export class LocationComponent {
  shopName = 'DS Jewellers';
  address = 'Hazratganj, Lucknow, Uttar Pradesh';   // asress
  phone = '+91 88741 96809';
  phoneLink = 'tel:+918874196809';
  timings = 'Mon - Sun: 10:30 AM to 8:30 PM';        // adress
  openAt = 10.5;                                     // 10:30 AM
  closeAt = 20.5;                                    // 8:30 PM

  mapUrl: SafeResourceUrl;
  directionsUrl: string;
  error = '';

  // images
  photos: Photo[] = [
    { src: 'https://plus.unsplash.com/premium_photo-1683140764019-641f6990d651?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Our Showroom' },
    { src: 'https://plus.unsplash.com/premium_photo-1661558675975-58ff8435b9f8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Bridal Collection' },
    { src: 'https://images.unsplash.com/photo-1606364167380-629c4492c694?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Gold Counter' }
  ];

  constructor(sanitizer: DomSanitizer) {
    const q = encodeURIComponent(this.address);
    this.mapUrl = sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps?q=${q}&output=embed`);
    this.directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  }

  get isOpen(): boolean {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    return h >= this.openAt && h < this.closeAt;
  }

  book(name: string, phone: string, message: string): void {
    const digits = phone.replace(/\D/g, '');
    if (!name.trim() || digits.length < 10) {
      this.error = 'Please enter your name and a valid 10-digit phone number.';
      return;
    }
    this.error = '';
    const text = `Hello ${this.shopName}, I would like to visit your shop.\nName: ${name.trim()}\nPhone: ${digits}\n${message.trim()}`;
    window.open('https://wa.me/918874196809?text=' + encodeURIComponent(text), '_blank');
  }
}


