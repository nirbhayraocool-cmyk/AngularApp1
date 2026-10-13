import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  standalone: false,
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  error = '';
  busy = false;

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) {
      router.navigate(['/admin']);
    }
  }

  async submit(e: Event, username: string, password: string): Promise<void> {
    e.preventDefault();
    if (!username.trim() || !password) {
      this.error = 'Please enter your username and password.';
      return;
    }
    this.busy = true;
    this.error = '';
    try {
      await this.auth.login(username.trim(), password);
      await this.router.navigate(['/admin']);
    } catch (err) {
      const status = (err as HttpErrorResponse).status;
      this.error =
        status === 429 ? 'Too many attempts. Please wait a minute and try again.'
          : status === 401 ? 'Invalid username or password.'
            : 'Could not sign in. Please try again.';
    } finally {
      this.busy = false;
    }
  }
}
