import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Iuser } from '../../interfaces/iuser.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class FormularioComponent {

  userForm: FormGroup;
  apiService = inject(ApiServiceService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  isNew: boolean;

  constructor(){
    this.isNew = true;
    this.userForm = new FormGroup({
      _id: new FormControl(null, []),
      id: new FormControl(null, []),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    },[])
  }

  async getDataForm(){
    let user = this.userForm.value as Iuser;
    //insertar uno nuevo
    if(this.isNew){
      const response = await this.apiService.insertUser(user);
      if(response.id){
        Swal.fire({
        title: "Usuario agregado correctamente",
        text: `Bienvenido ${response.username}`,
        icon: "success"
      });
      }

    }
    //actualizarlo
    else{
      const response = await this.apiService.updateUser(user);
      if(response.id){
        Swal.fire({
        title: "Usuario actualizado correctamente",
        icon: "success"
      });
      console.log(user);
      }
    }
    this.userForm.reset();
    this.router.navigate(['home']);

  }


  ngOnInit(): void{
    this.activatedRoute.params.subscribe(async(params:any) =>{
      let _id: string = params._id;
      if(_id != undefined){
        let miUser = await this.apiService.getUserById(_id);
        if(miUser != undefined){
          this.isNew = false;
          this.userForm = new FormGroup({
            _id: new FormControl(miUser._id, []),
            id: new FormControl(miUser.id, []),
            first_name: new FormControl(miUser.first_name, [Validators.required]),
            last_name: new FormControl(miUser.last_name, [Validators.required]),
            username: new FormControl(miUser.username, [Validators.required]),
            email: new FormControl(miUser.email, [Validators.required]),
            image: new FormControl(miUser.image, [Validators.required]),
            password: new FormControl(miUser.password, [Validators.required])
          },[])
        }else{
          alert("No se encuentra el user")
        }
      }
    })
  }



}
