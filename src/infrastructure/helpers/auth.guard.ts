import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@domain';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const accountService = inject(AccountService);
    const router = inject(Router);
    const user = accountService.userValue;

    if (user) {
        return true;
    }

    router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });

    return false; //router.parseUrl('/login');
};
