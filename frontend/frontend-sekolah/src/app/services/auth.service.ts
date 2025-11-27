import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkExistingToken();
  }

  private checkExistingToken() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      this.currentUserSubject.next({ token, role });
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${API_URL}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        this.currentUserSubject.next({
          token: res.token,
          role: res.role
        });
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  getToken(): string | null {
    return (
      this.currentUserSubject.value?.token || localStorage.getItem('token')
    );
  }
}
