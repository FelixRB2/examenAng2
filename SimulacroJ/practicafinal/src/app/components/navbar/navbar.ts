import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private router = inject(Router);

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role'); //recordar que este role seria el equivalente a un admin pero aqui he tenido que hacerlo con gender para mas info mira login.ts
    this.router.navigate(['/login']);
  }

  get isLoggedIn():boolean{
    return !!localStorage.getItem('accessToken'); //la expresion !! convierte un valor en booleano
  }
}
