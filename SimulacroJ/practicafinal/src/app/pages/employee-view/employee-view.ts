import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Iemployee } from '../../interfaces/iemployee';
import { EmployeesServices } from '../../services/employees-services';

@Component({
  selector: 'app-employee-view',
  imports: [RouterLink],
  templateUrl: './employee-view.html',
  styleUrl: './employee-view.css',
})
export class EmployeeView {

  employee!:Iemployee;
  employeeServices= inject(EmployeesServices);
  activatedRoute = inject(ActivatedRoute);
  constructor(){}

  ngOnInit():void{
    this.activatedRoute.params.subscribe(async(params:any)=>{
      let _id = params._id;
      if(_id != undefined){
        let response = await this.employeeServices.getEmployeeById(_id);
        if(response != undefined){
          this.employee = response;
        }
      }
    });
  }
}
