import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EmployeesServices } from '../../services/employees-services';
import { Iemployee } from '../../interfaces/iemployee';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule ,RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm {
  newEmployeeForm: FormGroup;
  employeeServices = inject(EmployeesServices);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  isNew: boolean;
  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  constructor(){
    this.newEmployeeForm = new FormGroup({
      _id: new FormControl(null,[]),
      id: new FormControl(null, []),
      first_name: new FormControl(null,[Validators.required, Validators.minLength(3)]),
      last_name: new FormControl(null,[Validators.required,  Validators.minLength(3)],),
      username: new FormControl(null,[Validators.required, Validators.minLength(3)]),
      email: new FormControl(null,[Validators.required,Validators.pattern(this.emailPattern)]),
      image: new FormControl(null,[Validators.required]),
      password: new FormControl(null,[Validators.required, Validators.minLength(8)])
    });
    this.isNew = true;
  }

  async getDataForm(){
    if(this.newEmployeeForm.invalid) return;
    let employee = this.newEmployeeForm.value as Iemployee;
    if(this.isNew){
      employee.id = -1; //El id lo gestiona el backend, le ponemos -1 para que no de error
      await this.employeeServices.createEmployee(employee);
      Swal.fire({
        title: "Added",
        text: "Employee successfully added",
        icon: "success"
      });
    }
    else{
      await this.employeeServices.updateEmployee(employee);
      Swal.fire({
        title: "Editado correctamente",
        text: "Se ha editado correctamente el usuario",
        icon: "success"
      });
    }
    this.router.navigate(['employees']);
  }


  ngOnInit(): void{
    this.activatedRoute.params.subscribe(async (params: any) =>{
      let _id: string = params._id;
      if(_id != undefined){
        let employee = await this.employeeServices.getEmployeeById(_id);
        if(employee != undefined){
          this.isNew = false;
          this.newEmployeeForm.patchValue(employee);
        } else if(employee == null){
          Swal.fire({
            title: "Error",
            text: "Error connecting to server",
            icon: "error"
          });
          this.router.navigate(['employees']);
        } else{
          Swal.fire({
            title: "Unkown",
            text: "Doesnt exist in our server",
            icon: "error"
          });
          this.router.navigate(['/employees']);
        }
      }
    })
  }

  checkControl(FormControlName: string, validator: string): boolean | undefined{
    return this.newEmployeeForm.get(FormControlName)?.hasError(validator) && this.newEmployeeForm.get(FormControlName)?.touched;
  }
}
