import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Si ya tiene token, está logueado
  if (localStorage.getItem('access_token')) {
    // Redirige a home porque ya está autenticado
    router.navigate(['/home']);
    return false; // Bloquea el acceso a /login
  }
  
  // Si NO tiene token, permite ir a login
  return true;
};