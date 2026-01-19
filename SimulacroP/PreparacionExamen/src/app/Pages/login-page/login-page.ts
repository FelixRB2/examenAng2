import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuario-service';
import { IUsuario } from '../../Interfaces/iusuario';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  private userService = inject(UsuarioService);
  private router = inject(Router);

  ngOninit(): void {
    if (localStorage.getItem('accessToken')){
      this.router.navigate(['/products']);
    }
  }
    
  async getUser(loginForm: NgForm){
    const loginUser: IUsuario = loginForm.value as IUsuario;
    loginUser.expiresInMins = 30;

    try{
      let response = await this.userService.login(loginUser);
      console.log(response);
      if(response.accessToken && response.refreshToken){
        localStorage.setItem("accesToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response));

        this.router.navigate(['/products']);
        loginForm.reset;
      }
    }catch (error){
      Swal.fire({
        theme: 'auto',
        title: "Datos incorrectos",
        icon: "error",
        draggable: true
      });

      loginForm.reset();
    }
  }

  

}
