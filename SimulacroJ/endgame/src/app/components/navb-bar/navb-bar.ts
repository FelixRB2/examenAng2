import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-navb-bar',
  imports: [RouterLink],
  templateUrl: './navb-bar.html',
  styleUrl: './navb-bar.css',
})
export class NavbBar {
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token'); //la expresion !! convierte el valor a booleano
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
