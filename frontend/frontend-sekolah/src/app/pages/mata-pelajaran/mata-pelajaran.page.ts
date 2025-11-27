import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TambahMapelModalComponent } from '../../modals/tambah-mapel-modal/tambah-mapel-modal.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mata-pelajaran',
  templateUrl: './mata-pelajaran.page.html',
  styleUrls: ['./mata-pelajaran.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MataPelajaranPage {
  dataMapel: any[] = [];
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
    this.apiService.getMataPelajaran().subscribe(res => {
      this.dataMapel = res;
    });
  }

  async tambah() {
    const modal = await this.modalCtrl.create({
      component: TambahMapelModalComponent
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async edit(mapel: any) {
    const modal = await this.modalCtrl.create({
      component: TambahMapelModalComponent,
      componentProps: { data: mapel }
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadData();
      }
    });
    await modal.present();
  }

  async delete(id: number) {
    if (confirm('Yakin ingin menghapus data mata pelajaran ini?')) {
      this.apiService.deleteMataPelajaran(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Gagal menghapus data mata pelajaran')
      });
    }
  }
}