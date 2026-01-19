import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { Ilogin } from '../../interfaces/ilogin'; // ← Cambia esto

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userLogin = inject(LoginService);
  private router = inject(Router);

  ngOnInit(): void{
    if(localStorage.getItem("accessToken")){
      this.router.navigate(['/home']);
    }
  }

  async getUser(loginForm: NgForm) {
    const loginUser: Ilogin = loginForm.value as Ilogin; // ← Cambia esto

    try {
        let response = await this.userLogin.login(loginUser);
        console.log('Respuesta completa:', response);
        
        // DummyJSON devuelve accessToken y refreshToken (camelCase, no snake_case)
        if (response.accessToken && response.refreshToken) {
            localStorage.setItem("access_token", response.accessToken);
            localStorage.setItem("refresh_token", response.refreshToken);
            localStorage.setItem("username", loginUser.username);
             // ← GUARDA EL ROL DEL USUARIO
            // DummyJSON devuelve información del usuario en response
            if (response.role) {
                localStorage.setItem("user_role", response.role);
            }
            localStorage.setItem('is_admin', String(response.isAdmin)); //POR SI FUESE ADMIN TRUE O FALSE

            this.router.navigate(['/home']);
            loginForm.reset();
        } else {
            alert("Error: No se recibieron los tokens");
        }

    } catch (error) {
        console.error('Error completo:', error);
        alert("Credenciales incorrectos");
        loginForm.reset();
    }
  }
}