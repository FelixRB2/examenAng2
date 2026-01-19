import { Router, RouterLink } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Login } from '../../interfaces/login.interface';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, RouterLink],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {

  private loginService = inject(LoginService);
  private router = inject(Router);


    isToken: boolean;

    constructor() {
        this.isToken = true;
    }


  ngOnInit(): void{
    if (localStorage.getItem('accessToken')){
      this.router.navigate(['/usuarios']);
    }
  }

  //get user
  async getUser(loginForm: NgForm){
    const loginUser: Login = loginForm.value as Login;
    loginUser.expiresInMins = 30;

    //Hay que hacer la petición de login
        try {
            let response = await this.loginService.login(loginUser);
            console.log(response);
            if (response.accessToken && response.refreshToken) {
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                localStorage.setItem("username", response.username);
                localStorage.setItem("role", response.gender);

                this.router.navigate(['/home']);
                loginForm.reset();
            }

        } catch (error) {
            alert("Credenciales incorrectos");
            loginForm.reset();
        }
  }


}
