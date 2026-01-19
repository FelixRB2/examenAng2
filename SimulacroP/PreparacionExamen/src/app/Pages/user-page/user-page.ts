import { Component, inject } from '@angular/core';
import { IUsuario } from '../../Interfaces/iusuario';
import { IUsuarioRegistrado } from '../../Interfaces/iusuario-registrado';
import { UsuarioService } from '../../Services/usuario-service';
import { NavBar } from "../../Components/nav-bar/nav-bar";

@Component({
  selector: 'app-user-page',
  imports: [NavBar],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})
export class UserPage {

  user! : IUsuarioRegistrado | null;
  registrado: boolean;
  ServicioUsuario = inject(UsuarioService);

  constructor(){
    this.registrado = false;
  }
  ngOnInit(){
    this.user = this.ServicioUsuario.getStoredUser();
    console.log(this.user);
  }
  
}
