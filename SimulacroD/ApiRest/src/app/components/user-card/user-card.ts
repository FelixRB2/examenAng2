import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service';
import { Iusuario } from '../../interfaces/iusuario';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  auth = inject(Authservice)//CON ESTO LO HAGO DIRECTAMENTE EN EL HTML

  @Input() usuario!: Iusuario;
  @Output() usuarioEliminado = new EventEmitter<string>()

 


    async eliminarUsuario(usuario: Iusuario) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      imageUrl: `${usuario.image}`,
      imageWidth: `250`,
      imageHeight: `250`,
      text: `Se eliminará a ${usuario.first_name} ${usuario.last_name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2b85daff',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    });
    

    if (result.isConfirmed) {
      this.usuarioEliminado.emit(usuario._id);
    }
  }
  
}