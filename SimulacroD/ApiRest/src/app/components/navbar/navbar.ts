import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(Authservice);
 private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token'); //la expresion !! convierte el valor a booleano
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  get Username(): string | null{
    return localStorage.getItem('username');
  }

}
