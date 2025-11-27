import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tambah-kelas-modal',
  templateUrl: './tambah-kelas-modal.component.html',
  styleUrls: ['./tambah-kelas-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class TambahKelasModalComponent {
  @Input() data: any = null;
  kelasForm: FormGroup;
  isEditMode = false;
  dataJurusan: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.kelasForm = this.fb.group({
      tingkatan: ['', Validators.required],
      nama_kelas: ['', Validators.required],
      id_jurusan: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.apiService.getJurusan().subscribe(res => {
      this.dataJurusan = res;
    });

    if (this.data) {
      this.isEditMode = true;
      this.kelasForm.patchValue(this.data);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.kelasForm.valid) {
      const action = this.isEditMode ? this.apiService.updateKelas(this.data.id, this.kelasForm.value) : this.apiService.addKelas(this.kelasForm.value);
      action.subscribe({
        next: (res) => this.modalCtrl.dismiss(res, 'confirm'),
        error: (err) => alert('Gagal menyimpan data kelas')
      });
    }
  }
}