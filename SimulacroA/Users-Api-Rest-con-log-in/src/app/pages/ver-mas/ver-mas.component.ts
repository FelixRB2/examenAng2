import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Iuser } from '../../interfaces/iuser.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-mas',
  imports: [RouterLink],
  templateUrl: './ver-mas.component.html',
  styleUrl: './ver-mas.component.css',
})
export class VerMasComponent {

  miUser!: Iuser;
  activatedRoute = inject(ActivatedRoute);
  userService = inject(ApiServiceService);

        ngOnInit(): void {
        //suscripcion para coger el parametro de la url
        this.activatedRoute.params.subscribe(async (params: any) => {
            // recoger el parametro
            let miId: string = params._id;
            if (miId != undefined) {
                // Pedir al servicio el user
                let response = await this.userService.getUserById(miId);
                if (response != undefined) {
                    // Rellenar mi propiedad miUser
                    this.miUser = response;
                }
            }
        });
    }

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
              //this.eliminar.emit(this.miUser._id); No uso el output ya que al volver al listado siempre va a cargar la lista entera otra vez
              // ya que es solo un filtrado visual no lo elimina al no tener back
            }
          });
       }
  }
