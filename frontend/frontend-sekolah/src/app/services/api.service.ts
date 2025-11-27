import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper untuk membuat header otentikasi (Versi Sederhana)
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // getToken() sekarang sinkron
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- DASHBOARD ---
  getDashboard(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${API_URL}/dashboard`, { headers });
  }

  // --- CRUD JURUSAN ---
  getJurusan(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${API_URL}/jurusan`, { headers });
  }

  // --- CRUD SISWA ---
  getSiswa(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${API_URL}/siswa`, { headers });
  }
  addSiswa(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${API_URL}/siswa`, data, { headers });
  }
  updateSiswa(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${API_URL}/siswa/${id}`, data, { headers });
  }
  deleteSiswa(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${API_URL}/siswa/${id}`, { headers });
  }

  // --- CRUD GURU ---
  getGuru(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${API_URL}/guru`, { headers });
  }
  addGuru(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${API_URL}/guru`, data, { headers });
  }
  updateGuru(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${API_URL}/guru/${id}`, data, { headers });
  }
  deleteGuru(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${API_URL}/guru/${id}`, { headers });
  }

  // --- CRUD KELAS ---
  getKelas(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${API_URL}/kelas`, { headers });
  }
  addKelas(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${API_URL}/kelas`, data, { headers });
  }
  updateKelas(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${API_URL}/kelas/${id}`, data, { headers });
  }
  deleteKelas(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${API_URL}/kelas/${id}`, { headers });
  }

  // --- CRUD MATA PELAJARAN ---
  getMataPelajaran(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${API_URL}/mata-pelajaran`, { headers });
  }
  addMataPelajaran(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${API_URL}/mata-pelajaran`, data, { headers });
  }
  updateMataPelajaran(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${API_URL}/mata-pelajaran/${id}`, data, { headers });
  }
  deleteMataPelajaran(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${API_URL}/mata-pelajaran/${id}`, { headers });
  }

  // --- CRUD PENGAJAR ---
  getPengajar(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${API_URL}/pengajar`, { headers });
  }
  addPengajar(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${API_URL}/pengajar`, data, { headers });
  }
  updatePengajar(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${API_URL}/pengajar/${id}`, data, { headers });
  }
  deletePengajar(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${API_URL}/pengajar/${id}`, { headers });
  }
}