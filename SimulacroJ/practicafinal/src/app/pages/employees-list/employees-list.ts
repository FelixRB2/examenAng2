import { EmployeesServices } from './../../services/employees-services';
import { Component, inject } from '@angular/core';
import { Iemployee } from '../../interfaces/iemployee';
import Swal from 'sweetalert2';
import { EmployeesCard } from "../../components/employees-card/employees-card";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-employees-list',
  imports: [EmployeesCard, RouterLink],
  templateUrl: './employees-list.html',
  styleUrl: './employees-list.css',
})
export class EmployeesList {

  arrayEmployees: Iemployee[];
  employeesServices = inject(EmployeesServices);

  constructor(){
    this.arrayEmployees = [];
  }

  pageActual: number = 1;
  totalPages: number = 1;
  totalEmployees: number = 0;
  employeesPerPage: number = 0;
  loading: boolean = false;

  async loadEmployees(page:number):Promise<void>{
    this.loading = true;
    try{
      const response = await this.employeesServices.getAllEmployees(page);
      this.arrayEmployees = response.results;
      this.pageActual = response.page;
      this.totalPages = response.total_pages;
      this.totalEmployees = response.total;
      this.employeesPerPage = response.per_page;
    } catch(error){
      console.error('Erorr loading employees:', error);
    } finally{
      this.loading = false;
    }
  }

  async ngOnInit(): Promise<void>{
    await this.loadEmployees(this.pageActual);
  }

  async onDeleteEmployee(employeeId: string): Promise<void>{
    try{
      await this.employeesServices.deleteEmployeeById(employeeId);
      this.arrayEmployees  = this.arrayEmployees.filter(employee => employee._id !== employeeId);
      if(this.arrayEmployees.length === 0 && this.pageActual >1){
        await this.loadEmployees(this.pageActual -1);
      }
      if(this.arrayEmployees.length === 0 && this.pageActual === 1){
        await this.loadEmployees(this.pageActual);
      }
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Employee successfully deleted.',
      });
    } catch(error){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error deleting employee, try later.',
      });
      console.log('Error deleting employee: ', error)
    }
  }

  //Métodos de navegación de páginas
  goToPage(page: number): void { // Ir a una página específica
    if (page >= 1 && page <= this.totalPages) { // Verificamos que la página esté dentro de los límites
      this.loadEmployees(page);
    }
  }

  goOneBack(): void{ // Ir una página atrás
    if(this.pageActual > 1){
      this.loadEmployees(this.pageActual - 1);
    }
  }

  goOneForward(): void{ // Ir una página adelante
    if(this.pageActual < this.totalPages){
      this.loadEmployees(this.pageActual + 1);
    }
  }
}
