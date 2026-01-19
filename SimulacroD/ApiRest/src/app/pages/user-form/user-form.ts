import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { Iusuario } from '../../interfaces/iusuario';
import { CommonModule } from '@angular/common';
import { CanComponentDeactivate } from '../../guards/unsaved-changes-guard';
 // ← IMPORTA

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserFormComponent implements CanComponentDeactivate { // ← IMPLEMENTA LA INTERFACE
  userForm: FormGroup;
  usuarioService = inject(UsuarioService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  isNew: boolean;
  
  private hasUnsavedChanges: boolean = false; // ← NUEVA PROPIEDAD

  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor() {
    this.isNew = true;
    this.userForm = this.createForm();
    this.trackFormChanges(); // ← RASTREA CAMBIOS
  }

  // ← NUEVO MÉTODO: Rastrea cambios en el formulario
  private trackFormChanges(): void {
    this.userForm.valueChanges.subscribe(() => {
      if (this.userForm.dirty) {
        this.hasUnsavedChanges = true;
      }
    });
  }

  // ← NUEVO MÉTODO: Requerido por el guard
  canDeactivate(): boolean {
    return !this.hasUnsavedChanges;
  }

  private createForm(): FormGroup {
    return new FormGroup({
      _id: new FormControl(null),
      id: new FormControl(null),
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]),
      image: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  getDataForm() {
    if (this.userForm.invalid) return;

    let usuario = this.userForm.value as Iusuario;

    if (this.isNew) {
      usuario.id = -1;

      this.usuarioService.create(usuario).then(response => {
        this.hasUnsavedChanges = false; // ← MARCA COMO GUARDADO
        alert('Usuario creado exitosamente');
        this.userForm.reset();
        this.router.navigate(['/usuarios']);
      }).catch(error => {
        console.error('Error al crear usuario:', error);
        alert('Error al crear el usuario');
      });
    } else {

      this.usuarioService.update(usuario).then(response => {
        this.hasUnsavedChanges = false; // ← MARCA COMO GUARDADO
        alert('Usuario actualizado exitosamente');
        this.userForm.reset();
        this.router.navigate(['/usuarios']);
      }).catch(error => {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar el usuario');
      });
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      let _id: string = params._id;
      if (_id != undefined) {
        this.usuarioService.getByID(_id).then(usuario => {
          if (usuario != undefined) {
            this.isNew = false;
            this.userForm.patchValue(usuario);
            this.hasUnsavedChanges = false; // ← RESETEA AL CARGAR
            this.userForm.markAsPristine(); // ← MARCA COMO NO MODIFICADO
          } else {
            alert("No se encuentra el usuario");
            this.router.navigate(['/usuarios']);
          }
        }).catch(error => {
          console.error('Error al cargar usuario:', error);
          alert("Error al cargar el usuario");
          this.router.navigate(['/usuarios']);
        });
      }
    });
  }

  checkControl(formControlName: string, validator: string): boolean | undefined {
    return this.userForm.get(formControlName)?.hasError(validator) &&
      this.userForm.get(formControlName)?.touched;
  }

  

  onReset(): void {
    if (confirm('¿Estás seguro de que deseas resetear el formulario?')) {
      if (this.isNew) {
        this.userForm.reset();
        this.hasUnsavedChanges = false; // ← RESETEA
      } else {
        const _id = this.activatedRoute.snapshot.params['_id']; 
        if (_id) {
          this.usuarioService.getByID(_id).then(usuario => {
            if (usuario) {
              this.userForm.patchValue(usuario);
              this.hasUnsavedChanges = false; // ← RESETEA
              this.userForm.markAsPristine(); // ← MARCA COMO NO MODIFICADO
            }
          });
        }
      }
    }
  }
}