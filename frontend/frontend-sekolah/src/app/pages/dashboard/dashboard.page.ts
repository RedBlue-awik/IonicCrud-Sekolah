import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Impor semua komponen Ionic yang dibutuhkan
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent, 
  IonIcon, 
  IonButtons, 
  IonButton,
  IonList,
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  ModalController 
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TambahPengajarModalComponent } from '../../modals/tambah-pengajar-modal/tambah-pengajar-modal.component';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, 
  peopleOutline, 
  schoolOutline, 
  libraryOutline, 
  bookOutline, 
  addOutline, 
  createOutline, 
  trashOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  // --- PERBAIKAN DI SINI ---
  // Pastikan semua komponen yang dipakai di HTML ada di sini
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard, 
    IonCardHeader,
    IonCardTitle,
    IonCardContent, 
    IonIcon, 
    IonButtons, 
    IonButton,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    CommonModule
  ]
})
export class DashboardPage implements OnInit {
  dashboardData: any = {};
  userRole: string | null = null;
  dataPengajar: any[] = [];

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private modalCtrl: ModalController
  ) {
    addIcons({ 
      logOutOutline, 
      peopleOutline, 
      schoolOutline, 
      libraryOutline, 
      bookOutline, 
      addOutline, 
      createOutline, 
      trashOutline 
    });
  }

  ngOnInit() {
    this.userRole = this.authService.getRole();
    this.loadDashboardData();
    this.loadPengajarData();
  }

  loadDashboardData() {
    this.apiService.getDashboard().subscribe((data) => {
      this.dashboardData = data;
    });
  }

  loadPengajarData() {
    this.apiService.getPengajar().subscribe(res => {
      this.dataPengajar = res;
    });
  }

  async tambahPengajar() {
    const modal = await this.modalCtrl.create({
      component: TambahPengajarModalComponent
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadPengajarData();
      }
    });
    await modal.present();
  }

  async editPengajar(pengajar: any) {
    const modal = await this.modalCtrl.create({
      component: TambahPengajarModalComponent,
      componentProps: { data: pengajar }
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadPengajarData();
      }
    });
    await modal.present();
  }

  async deletePengajar(id: number) {
    if (confirm('Yakin ingin menghapus data penempatan guru ini?')) {
      this.apiService.deletePengajar(id).subscribe({
        next: () => this.loadPengajarData(),
        error: () => alert('Gagal menghapus data penempatan guru')
      });
    }
  }
}