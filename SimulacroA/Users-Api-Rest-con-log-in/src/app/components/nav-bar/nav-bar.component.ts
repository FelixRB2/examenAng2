import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
    private router = inject(Router);

    isToken: boolean;
    username: string;
    role: string;
    //admin: boolean;

    constructor() {
        this.isToken = false;
        this.username = "";
        this.role = "";
        //this.admin = false;
    }

ngOnInit(): void {
  this.username = localStorage.getItem('username') ?? ''; //tiene los interrogantes ya que devuelve string | null

  this.role = localStorage.getItem('role') ?? ''; //tiene los interrogantes ya que devuelve string | null

  if (localStorage.getItem('accessToken')) {
    this.isToken = true;
  }
}

  //para saber si es admin para mostrar el añadir usuario
get isAdmin(): boolean {
  return this.role === 'female';
}

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.isToken = false;
        this.router.navigate(['/login']);
    }
}
