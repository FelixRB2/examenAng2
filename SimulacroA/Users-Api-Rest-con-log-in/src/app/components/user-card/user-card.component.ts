import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Iuser } from '../../interfaces/iuser.interface';
import { ApiServiceService } from '../../services/api-service.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {

  userService = inject(ApiServiceService);
  @Input() miUser!: Iuser;
  @Output() eliminar = new EventEmitter<string>();//output para eliminar en el array de la lista ya que no hay back y asi sea mas visual

      async deleteUser(user: Iuser) {

      await Swal.fire({
        title: `Quieres eliminar a ${user.username}?`,
        text: "No vas a poder restablecerlo",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar"
      }).then((result) => {

        if (result.isConfirmed) {
        this.userService.deleteById(user._id!);
          Swal.fire({
            title: "Eliminado",
            text: `Has eliminado a ${user.username}`,
            icon: "success"
          });
          this.eliminar.emit(this.miUser._id);
        }
      });




    }


}
