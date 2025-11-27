import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TambahKelasModalComponent } from '../../modals/tambah-kelas-modal/tambah-kelas-modal.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-kelas',
  templateUrl: './kelas.page.html',
  styleUrls: ['./kelas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class KelasPage {
  dataKelas: any[] = [];
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
    this.apiService.getKelas().subscribe(res => {
      this.dataKelas = res;
    });
  }

  async tambah() {
    const modal = await this.modalCtrl.create({
      component: TambahKelasModalComponent
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async edit(kelas: any) {
    const modal = await this.modalCtrl.create({
      component: TambahKelasModalComponent,
      componentProps: { data: kelas }
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async delete(id: number) {
    if (confirm('Yakin ingin menghapus data kelas ini?')) {
      this.apiService.deleteKelas(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Gagal menghapus data kelas')
      });
    }
  }
}