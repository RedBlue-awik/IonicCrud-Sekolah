import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tambah-siswa-modal',
  templateUrl: './tambah-siswa-modal.component.html',
  styleUrls: ['./tambah-siswa-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class TambahSiswaModalComponent {
  @Input() data: any = null;
  siswaForm: FormGroup;
  isEditMode = false;
  dataKelas: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.siswaForm = this.fb.group({
      nis: ['', Validators.required],
      nama_siswa: ['', Validators.required],
      id_kelas: [null, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.apiService.getKelas().subscribe((res) => {
      this.dataKelas = res;
    });

    if (this.data) {
      this.isEditMode = true;
      this.siswaForm.patchValue({
        nis: this.data.nis,
        nama_siswa: this.data.nama_siswa,
        id_kelas: this.data.id_kelas,
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.siswaForm.valid) {
      if (this.isEditMode) {
        this.apiService
          .updateSiswa(this.data.id, this.siswaForm.value)
          .subscribe({
            next: (res) => this.modalCtrl.dismiss(res, 'confirm'),
            error: (err) => alert('Gagal mengupdate data siswa'),
          });
      } else {
        this.apiService.addSiswa(this.siswaForm.value).subscribe({
          next: (res) => this.modalCtrl.dismiss(res, 'confirm'),
          error: (err) => alert('Gagal menambah data siswa'),
        });
      }
    }
  }
}
