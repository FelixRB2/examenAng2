import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('user_role') === 'admin';
  }
  isAdmin1(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
  }
}
