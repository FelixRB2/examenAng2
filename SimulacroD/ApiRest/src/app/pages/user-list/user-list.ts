import { Component, inject } from '@angular/core';
import { Iusuario } from '../../interfaces/iusuario';
import { UsuarioService } from '../../services/usuario-service';
import { UserCard } from "../../components/user-card/user-card";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [UserCard, CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {

  arrUSuarios: Iusuario[] = [];
  Susuaruis = inject(UsuarioService);

  
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalUsuarios: number = 0;
  usuariosPorPagina: number = 0;
  cargando: boolean = false;

  async cargarUsuarios(pagina: number): Promise<void> {
    this.cargando = true;
    try {
      const response = await this.Susuaruis.getAllUsers(pagina);

      this.arrUSuarios = response.results;
      this.paginaActual = response.page;
      this.totalPaginas = response.total_pages;
      this.totalUsuarios = response.total;
      this.usuariosPorPagina = response.per_page;
    } catch (error) {
      // Aquí manejamos el error 
      console.error('Error al obtener los usuarios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios',
      });
    } finally {
      // finally lo ejecuta SIEMPRE, haya error o no
      // Sin finally, si hay error el cargando quedaría en true para siempre
      this.cargando = false;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.cargarUsuarios(1);
  }

  async onUsuarioEliminado(id: string): Promise<void> {
    try {
      await this.Susuaruis.eliminarUsuarioID(id);

      this.arrUSuarios = this.arrUSuarios.filter(user => user._id !== id);
      // Si después de eliminar la página queda vacia y no es la primera veulve a la anterior
      if (this.arrUSuarios.length === 0 && this.paginaActual > 1) {
        await this.cargarUsuarios(this.paginaActual - 1);
      }
      if (this.arrUSuarios.length === 0 && this.paginaActual ) {
        await this.cargarUsuarios(this.paginaActual +1);
      }

      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'Usuario eliminado correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el usuario',
      });
    }
  }

  //metodos q voy a usar para pasar de paginas

  irAPagina(pagina: number): void {
  // Verifico que la página exista
  const paginaValida = pagina >= 1 && pagina <= this.totalPaginas;
  
  if (paginaValida) {
    this.cargarUsuarios(pagina);
  }
}

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.cargarUsuarios(this.paginaActual -1);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.cargarUsuarios(this.paginaActual + 1);
    }
  }

  
}