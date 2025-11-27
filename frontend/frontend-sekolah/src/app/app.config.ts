import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { TambahPengajarModalComponent } from './modals/tambah-pengajar-modal/tambah-pengajar-modal.component'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideIonicAngular(),
    AuthService,
    TambahPengajarModalComponent,
  ],
};