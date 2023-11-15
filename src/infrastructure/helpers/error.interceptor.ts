import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AccountService } from "@domain";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor<T> implements HttpInterceptor {
    private accountService = inject(AccountService);

    intercept(
        request: HttpRequest<T>,
        next: HttpHandler
    ): Observable<HttpEvent<T>> {
        return next.handle(request).pipe(
            catchError(err => {
                if (
                    [401, 403].includes(err.status) &&
                    this.accountService.userValue
                ) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    this.accountService.logout();
                }

                const error = err.error?.message || err.statusText;
                console.error("ERROR INTERCEPTOR:", err);
                return throwError(() => error);
            })
        );
    }
}
