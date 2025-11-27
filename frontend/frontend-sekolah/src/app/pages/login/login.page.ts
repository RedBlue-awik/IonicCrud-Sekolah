import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPage {
  credentials: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  async login() {
    if (this.credentials.valid) {
      this.authService.login(this.credentials.value).subscribe({
        next: async (res) => {
          // Ganti bagian `next` dengan ini
          alert('Success! Login berhasil.');
          this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
        },
        error: async (err: any) => {
          console.error('Error dari backend:', err);
          // Ganti bagian `error` dengan ini
          const pesanError = err.error?.message || 'Username atau password salah.';
          alert('Error! ' + pesanError);
        }
      });
    }
  }
}