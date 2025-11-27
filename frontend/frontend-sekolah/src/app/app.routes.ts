import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard', 
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'siswa',
        loadComponent: () => import('./pages/siswa/siswa.page').then(m => m.SiswaPage),
      },
      {
        path: 'guru',
        loadComponent: () => import('./pages/guru/guru.page').then(m => m.GuruPage),
      },
      {
        path: 'kelas',
        loadComponent: () => import('./pages/kelas/kelas.page').then(m => m.KelasPage),
      },
      {
        path: 'mata-pelajaran',
        loadComponent: () => import('./pages/mata-pelajaran/mata-pelajaran.page').then(m => m.MataPelajaranPage),
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/tabs/dashboard'
  }
];