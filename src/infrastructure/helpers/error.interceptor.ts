import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AccountService } from "@domain";
import { catchError, throwError } from "rxjs";

export function errorInterceptor<T> (request: HttpRequest<T>,
        next: HttpHandlerFn) {
    const accountService = inject(AccountService);

    return next(request).pipe(
        catchError(err => {
            if (
                [401, 403].includes(err.status) &&
                accountService.userValue
            ) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                accountService.logout();
            }

            const error = err.error?.message || err.statusText;
            //console.log(err)
            console.error("ERROR INTERCEPTOR:", err);
            return throwError(() => error);
        })
    );

}
