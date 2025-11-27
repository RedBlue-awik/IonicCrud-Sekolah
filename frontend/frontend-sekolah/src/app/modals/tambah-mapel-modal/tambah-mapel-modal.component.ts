import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tambah-mapel-modal',
  templateUrl: './tambah-mapel-modal.component.html',
  styleUrls: ['./tambah-mapel-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class TambahMapelModalComponent {
  @Input() data: any = null;
  mapelForm: FormGroup;
  isEditMode = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.mapelForm = this.fb.group({
      nama_mapel: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.isEditMode = true;
      this.mapelForm.patchValue(this.data);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.mapelForm.valid) {
      const action = this.isEditMode ? this.apiService.updateMataPelajaran(this.data.id, this.mapelForm.value) : this.apiService.addMataPelajaran(this.mapelForm.value);
      action.subscribe({
        next: (res) => this.modalCtrl.dismiss(res, 'confirm'),
        error: (err) => alert('Gagal menyimpan data mata pelajaran')
      });
    }
  }
}