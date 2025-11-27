import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tambah-pengajar-modal',
  templateUrl: './tambah-pengajar-modal.component.html',
  styleUrls: ['./tambah-pengajar-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class TambahPengajarModalComponent {
  @Input() data: any = null;
  pengajarForm: FormGroup;
  isEditMode = false;
  dataGuru: any[] = [];
  dataMapel: any[] = [];
  dataKelas: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.pengajarForm = this.fb.group({
      id_guru: [null, Validators.required],
      id_mapel: [null, Validators.required],
      id_kelas: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.apiService.getGuru().subscribe(res => this.dataGuru = res);
    this.apiService.getMataPelajaran().subscribe(res => this.dataMapel = res);
    this.apiService.getKelas().subscribe(res => this.dataKelas = res);

    if (this.data) {
      this.isEditMode = true;
      this.pengajarForm.patchValue(this.data);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.pengajarForm.valid) {
      const action = this.isEditMode ? this.apiService.updatePengajar(this.data.id, this.pengajarForm.value) : this.apiService.addPengajar(this.pengajarForm.value);
      action.subscribe({
        next: (res) => this.modalCtrl.dismiss(res, 'confirm'),
        error: (err) => alert('Gagal menyimpan data penempatan guru')
      });
    }
  }
}