import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { Router, RouterLink } from '@angular/router';
import { Iuser } from '../../interfaces/iuser';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userLogin = inject(LoginService);
  private router = inject(Router);


  ngOnInit(): void{
    if(localStorage.getItem("access_token")){
      this.router.navigate(['/home']);
    }
  }
async getUser(loginForm: NgForm) {
        const loginUser: Iuser = loginForm.value as Iuser;

        //Hay que hacer la petición de login
        try {
            let response = await this.userLogin.login(loginUser);
            console.log(response);
            if (response.access_token && response.refresh_token) {
                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("refresh_token", response.refresh_token);

                this.router.navigate(['/home']);
                loginForm.reset();
            }

        } catch (error) {
            alert("Credenciales incorrectos");
            loginForm.reset();
        }

    }
}
