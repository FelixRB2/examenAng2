import { CanDeactivateFn } from '@angular/router';

// Interface que deben implementar los componentes que usen este guard
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  
  // Si el componente puede desactivarse, permite la navegación
  if (component.canDeactivate()) {
    return true;
  }
  
  // Si no, pregunta al usuario
  return confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?');
};