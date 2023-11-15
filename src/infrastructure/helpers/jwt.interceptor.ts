import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AccountService } from "@domain";
import { environment } from "@environments";

export function jwtInterceptor<T>(request: HttpRequest<T>,
        next: HttpHandlerFn) {
        // add auth header with jwt if user is logged in and request is to the api url
    const accountService = inject(AccountService);
    const user = accountService.userValue;
    const isLoggedIn = user?.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
console.log("RRRR", isLoggedIn && isApiUrl);
    if (isLoggedIn && isApiUrl) {
        request = request.clone({
            setHeaders: { Authorization: `Bearer ${user.token}` },
        });
    }

    return next(request);
}
