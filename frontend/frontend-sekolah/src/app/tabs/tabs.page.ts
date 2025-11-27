import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { gridOutline, peopleOutline, schoolOutline, libraryOutline, bookOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class TabsPage {
  constructor(public authService: AuthService) {
    addIcons({
      'grid-outline': gridOutline,
      'people-outline': peopleOutline,
      'school-outline': schoolOutline,
      'library-outline': libraryOutline,
      'book-outline': bookOutline,
    });
  }
}