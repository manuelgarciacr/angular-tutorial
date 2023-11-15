import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '@domain';

export const authGuard: CanActivateFn = () => {
    const accountService = inject(AccountService);
    const router = inject(Router);

    if (accountService.userValue) {
        return true;
    }
    return router.parseUrl('/login');
};
