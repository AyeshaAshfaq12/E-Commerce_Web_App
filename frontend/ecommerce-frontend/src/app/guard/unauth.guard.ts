import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const unauthGuard: CanActivateFn = (route, state) => {
   const authService = inject(AuthService);

  if (authService.isAuthenticated()) {

    return false;
  } else {
    return true;
  }
};
