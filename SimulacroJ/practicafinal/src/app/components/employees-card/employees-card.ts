import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EmployeesServices } from '../../services/employees-services';
import { Iemployee } from '../../interfaces/iemployee';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-employees-card',
  imports: [RouterLink],
  templateUrl: './employees-card.html',
  styleUrl: './employees-card.css',
})
export class EmployeesCard {

  employeesServices = inject(EmployeesServices);
  @Input() employee!: Iemployee;
  @Output() employeeDeleted = new EventEmitter<string>();

  async deleteEmployee(employee:Iemployee){
    const response = await Swal.fire({
      title: 'Are you sure?',
      text: `You are going to delete employee ${employee.first_name} ${employee.last_name}. This action cannot be undo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });
    if(response.isConfirmed){
      try{
        await this.employeesServices.deleteEmployeeById(employee._id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: `Employee ${employee.first_name} ${employee.last_name} deleted.`,
        });

        this.employeeDeleted.emit(employee._id);
      } catch (error) {
        console.error('Error deleting employee:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `An error has ocurred while deleting employee: ${employee.first_name} ${employee.last_name}. Try again later.`,
        });
      }
    }
  }
}
