import { Auth } from './../models/auth';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Interet } from '../models/interet';
import { UserSearch } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environnement/environnement';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private token = ""; 
  


  constructor(private http: HttpClient, private router: Router) {}

  getInterets() {
  return this.http.get<Interet[]>(`${this.apiUrl}/interet`);
}

  async registerUser(data: any): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.apiUrl}/register`, data));
  }

  async login(data: { email: string; password: string }): Promise<any> {
    console.log(' Données envoyées au backend lors du login :', data);

    try {
      const response = await firstValueFrom(this.http.post<Auth>(`${this.apiUrl}/login`, data));
      console.log(' Réponse reçue du serveur :', response);
      const token = response.data.token;
      this.token = token;

      this.saveUserSession(token, response.data);

console.log('Token sauvegardé dans le localStorage :', localStorage.getItem('access_token'));

       
       this.isLoggedInSubject.next(true);

      return response;
    } catch (error) {
      console.error(' Erreur lors du login :', error);
      throw error;
    }
  }

  async socialLogin(provider: 'google' | 'facebook'): Promise<void> {
    const authUrl = `${this.apiUrl}/auth/${provider}/callback`;
    window.location.href = authUrl;
  }

  saveUserSession(token: string, user: any): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('access_token');
  }

   hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('name');

    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }


  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, email: string, password: string, confirmPassword: string) {
  const payload = {
    token,
    email,
    password,
    password_confirmation: confirmPassword
  };
  return this.http.post(`${this.apiUrl}/reset-password`, payload);
}

  getUserById(id: string): Observable<{ data : UserSearch}> {
    return this.http.get<{data : UserSearch}>(`${this.apiUrl}/user/${id}`);
  }

  initializeSession(): void {
  const token = this.getToken();
  const user = this.getCurrentUser();

  if (token && user) {
    this.isLoggedInSubject.next(true);
  } else {
    this.isLoggedInSubject.next(false);
  }
}

}
