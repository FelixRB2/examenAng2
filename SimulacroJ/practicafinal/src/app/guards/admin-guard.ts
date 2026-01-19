import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  let isAdmin: boolean = false;
  if((localStorage.getItem('role') === 'female')){
    isAdmin = true;
  } else {
    router.navigate(['/employees']);
  }
  return isAdmin;
};
