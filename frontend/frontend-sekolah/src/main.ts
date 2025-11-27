import { bootstrapApplication } from '@angular/platform-browser';

// === INI ADALAH KUNCI NYA ===
// Import konfigurasi dari file app.config.ts
import { appConfig } from './app/app.config';

import { AppComponent } from './app/app.component';

// Gunakan appConfig saat menjalankan aplikasi
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));