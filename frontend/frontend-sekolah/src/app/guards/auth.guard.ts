import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  // 1. Inject AuthService dan Router
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Periksa apakah token ada menggunakan AuthService
  const token = authService.getToken();

  if (token) {
    // Jika token ada, izinkan pengaksesan rute
    return true;
  } else {
    // Jika tidak ada token, arahkan ke halaman login
    router.navigate(['/login']);
    return false;
  }
};