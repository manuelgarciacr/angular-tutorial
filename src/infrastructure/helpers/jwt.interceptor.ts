import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AccountService } from "@domain";
import { environment } from "@environments";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor<T> implements HttpInterceptor {
    private accountService = inject(AccountService);

    intercept(
        request: HttpRequest<T>,
        next: HttpHandler
    ): Observable<HttpEvent<T>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.accountService.userValue;
        const isLoggedIn = user?.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${user.token}` },
            });
        }

        return next.handle(request);
    }
}
