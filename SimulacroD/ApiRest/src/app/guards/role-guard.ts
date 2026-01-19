import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  //LO EXPLICO EN README 
  // Obtiene el rol requerido desde la configuración de la ruta
  const expectedRole = route.data['role'];
  
  // Obtiene el rol del usuario desde localStorage
  const userRole = localStorage.getItem('user_role');

  // Si el usuario tiene el rol esperado, permite el acceso
  if (userRole === expectedRole) {
    return true;
  } else {
    // Si no tiene el rol, redirige a home
    alert('No tienes permisos para acceder a esta página');
    router.navigate(['/home']);
    return false;
  }
};