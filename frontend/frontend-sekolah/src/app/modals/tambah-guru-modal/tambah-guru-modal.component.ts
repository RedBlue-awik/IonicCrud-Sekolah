import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tambah-guru-modal',
  templateUrl: './tambah-guru-modal.component.html',
  styleUrls: ['./tambah-guru-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class TambahGuruModalComponent {
  @Input() data: any = null;
  guruForm: FormGroup;
  isEditMode = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.guruForm = this.fb.group({
      nip: ['', Validators.required],
      nama_guru: ['', Validators.required],
      username: ['', Validators.required], 
      password: ['', Validators.required]  
    });
  }

  ngOnInit() {
    if (this.data) {
      this.isEditMode = true;
      this.guruForm.patchValue({
        nip: this.data.nip,
        nama_guru: this.data.nama_guru
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.guruForm.valid) {
      const action = this.isEditMode ? this.apiService.updateGuru(this.data.id, this.guruForm.value) : this.apiService.addGuru(this.guruForm.value);
      action.subscribe({
        next: (res) => this.modalCtrl.dismiss(res, 'confirm'),
        error: (err) => alert('Gagal menyimpan data guru')
      });
    }
  }
}