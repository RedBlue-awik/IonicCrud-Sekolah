import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TambahGuruModalComponent } from '../../modals/tambah-guru-modal/tambah-guru-modal.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-guru',
  templateUrl: './guru.page.html',
  styleUrls: ['./guru.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class GuruPage {
  dataGuru: any[] = [];
  userRole: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    addIcons({ addOutline, createOutline, trashOutline });
  }

  ionViewWillEnter() {
    this.userRole = this.authService.getRole();
    this.loadData();
  }

  loadData() {
    this.apiService.getGuru().subscribe(res => {
      this.dataGuru = res;
    });
  }

  async tambah() {
    const modal = await this.modalCtrl.create({
      component: TambahGuruModalComponent
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async edit(guru: any) {
    const modal = await this.modalCtrl.create({
      component: TambahGuruModalComponent,
      componentProps: { data: guru }
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async delete(id: number) {
    if (confirm('Yakin ingin menghapus data guru ini?')) {
      this.apiService.deleteGuru(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Gagal menghapus data guru')
      });
    }
  }
}