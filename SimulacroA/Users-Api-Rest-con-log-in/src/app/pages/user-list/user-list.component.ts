import { Component, inject } from '@angular/core';
import { Iuser } from '../../interfaces/iuser.interface';
import { ApiServiceService } from '../../services/api-service.service';
import { UserCardComponent } from "../../components/user-card/user-card.component";

@Component({
  selector: 'app-user-list',
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {

  usersArray: Iuser[];
  usersService = inject(ApiServiceService);
  // Propiedades para la paginación
  currentPage: number;
  totalPages: number; //el numero total de paginas

  constructor(){
    this.usersArray = [];
    this.currentPage = 1;
    this.totalPages = 2; //pongo 2 porque es el numero que pasa la api
  }

  ngOnInit(): void{
    this.loadUsers(this.currentPage);
  }

  // Método para cargar usuarios de una pagina especifica, en esta practica al tener unicamente 2 paginas solo lo usare el el ngOnInit
  async loadUsers(page: number): Promise<void> {
    try {
      const response = await this.usersService.getAllUsers(page);
      this.usersArray = response.results;
      this.currentPage = response.page;
      this.totalPages = response.total_pages;
      console.log(this.usersArray);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  // Método para ir a la página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  // Método para ir a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }


  //elimino del array para que sea mas visual ya que no hay back
  deleteUser(_id: string){
    this.usersArray = this.usersArray.filter(u => u._id !== _id);
  }

}
