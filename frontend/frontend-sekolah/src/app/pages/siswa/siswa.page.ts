import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TambahSiswaModalComponent } from '../../modals/tambah-siswa-modal/tambah-siswa-modal.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-siswa',
  templateUrl: './siswa.page.html',
  styleUrls: ['./siswa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SiswaPage {
  dataSiswa: any[] = [];
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
    this.apiService.getSiswa().subscribe(res => {
      this.dataSiswa = res;
    });
  }

  async tambah() {
    const modal = await this.modalCtrl.create({
      component: TambahSiswaModalComponent
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async edit(siswa: any) {
    const modal = await this.modalCtrl.create({
      component: TambahSiswaModalComponent,
      componentProps: { data: siswa }
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async delete(id: number) {
    if (confirm('Yakin ingin menghapus data siswa ini?')) {
      this.apiService.deleteSiswa(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Gagal menghapus data siswa')
      });
    }
  }
}