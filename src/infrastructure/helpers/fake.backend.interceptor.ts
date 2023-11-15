import { Injectable, Provider } from "@angular/core";
import {
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, materialize, dematerialize } from "rxjs/operators";
import { IUser, LoggedUser } from "@domain";

const users: IUser[] = [
    {
        id: 1,
        firstName: "Jason",
        lastName: "Watmore",
        username: "test",
        password: "test",
    }
];

@Injectable()
export class FakeBackendInterceptor<T> implements HttpInterceptor {

    intercept(
        request: HttpRequest<T>,
        next: HttpHandler
    ): Observable<HttpEvent<T>> {
        const { url, method, body } = request;

        return handleRoute();

        function handleRoute() {

            switch (true) {
                case url.endsWith("/users/authenticate") && method === "POST":
                    return authenticate();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body as Partial<IUser>;
            const user = users.find(
                x => x.username === username && x.password === password
            );

            if (!user) return error("Username or password is incorrect");

            return ok(
                { ...user as Omit<IUser, "password">, token: "fake-jwt-token" }
            );
        }

        // helper functions

        function ok(body?: LoggedUser) {
            return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: string) {

            return throwError(() => ({ error: { message } })).pipe(
                materialize(),
                delay(500),
                dematerialize(),
            ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }
    }
}

export const fakeBackendProvider: Provider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true,
};