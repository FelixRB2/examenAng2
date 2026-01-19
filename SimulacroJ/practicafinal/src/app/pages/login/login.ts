import { Userservices } from './../../services/userservices';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Iuser } from '../../interfaces/iuser';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private userservices = inject(Userservices);
  private router = inject(Router);

  ngOnInit(): void {
    if(localStorage.getItem('accessToken')){
      this.router.navigate(['/home']);
    }
  }

  async getLoginInfo(loginForm: NgForm) {
    const loginData = loginForm.value as Iuser;
    loginData.expiresInMins = 1;
    try {
      let response = await this.userservices.login(loginData);
      console.log(response);
      if(response.accessToken && response.refreshToken){
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('role', response.gender); //voy a simular que existe un rol admin con el genero femenino y el masculino seria un usuario corriente
        this.router.navigate(['/home']);
        loginForm.reset();
      }
    } catch (error) {
      console.error('Login failed', error);
      loginForm.reset();
    }
  }
}
