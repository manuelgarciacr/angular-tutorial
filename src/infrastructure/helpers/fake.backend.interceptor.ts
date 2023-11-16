import {
    HttpRequest,
    HttpResponse,
    HttpHandlerFn,
} from "@angular/common/http";
import { of, throwError } from "rxjs";
import { delay, materialize, dematerialize } from "rxjs/operators";
import { BasicUser, IUser, LoggedUser } from "@domain";

const usersKey = "angular-tutorial-users";
const users: IUser[] = JSON.parse(localStorage.getItem(usersKey)!) || [];

export function fakeBackendInterceptor<T>(request: HttpRequest<T>,
        next: HttpHandlerFn) {
    const { url, method, headers, body } = request;
console.log("FAKE", url, method, headers, body)
    return handleRoute();

    function handleRoute() {

        switch (true) {
            case url.endsWith("/users/authenticate") && method === "POST":
                return authenticate();
            case url.endsWith("/users/register") && method === "POST":
                return register();
            case url.endsWith("/users") && method === "GET":
                return getUsers();
            case url.match(/\/users\/\d+$/) && method === "GET":
                return getUserById();
            case url.match(/\/users\/\d+$/) && method === "PUT":
                return updateUser();
            case url.match(/\/users\/\d+$/) && method === "DELETE":
                return deleteUser();
            default:
                // pass through any requests not handled above
                return next(request);
        }
    }

    // route functions

    function authenticate() {
        const { username, password } = body as Partial<IUser> ;
        const user = users.find(
            v => v.username === username && v.password === password
        );

        if (!user) return error("Username or password is incorrect");

        return ok(
            { ...user as BasicUser, token: "fake-jwt-token" }
        );
    }

    function register() {
        const user = body as Partial<IUser>;

        if (users.find(v => v.username === user.username)) {
            return error(
                'Username "' + user.username + '" is already taken'
            );
        }

        user.id = users.length ? Math.max(...users.map(v => v.id)) + 1 : 1;
        users.push(user as IUser);
        localStorage.setItem(usersKey, JSON.stringify(users));

        return ok();
    }

    function getUsers() {

        if (!isLoggedIn()) return unauthorized();

        return ok(users.map(v => v as BasicUser));
    }

    function getUserById() {

        if (!isLoggedIn()) return unauthorized();

        const user = users.find(v => v.id === idFromUrl());

        return ok(user as BasicUser);
    }

    function updateUser() {
        if (!isLoggedIn()) return unauthorized();

        const params = body as Partial<IUser>;
        const user = users.find(v => v.id === idFromUrl());
console.log("UU", params, user);

        // only update password if entered
        if (!params.password) {
            delete params.password;
        }

        // update and save user
        Object.assign(user!, params);
console.log("UU2", user);
        localStorage.setItem(usersKey, JSON.stringify(users));

        return ok();
    }

    function deleteUser() {

        if (!isLoggedIn()) return unauthorized();

        users.splice(users.findIndex(v => v.id === idFromUrl()), 1);
        localStorage.setItem(usersKey, JSON.stringify(users));

        return ok();
    }

    // helper functions

    function ok(body?: LoggedUser | BasicUser | BasicUser[]) {
        // delay observable to simulate server api call
        return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }

    function error(message: string) {

        return throwError(() => ({ error: { message } })).pipe(
            materialize(),
            delay(500),
            dematerialize(),
        ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function unauthorized() {

        return throwError(() => ({
            status: 401,
            error: { message: "Unauthorized" },
        })).pipe(materialize(), delay(500), dematerialize());
    }

    function isLoggedIn() {

        return headers.get("Authorization") === "Bearer fake-jwt-token";
    }

    function idFromUrl() {
        const id = url.split("/").pop();

        return parseInt(id!);
    }
}

// export const fakeBackendProvider: Provider = {
//     // use fake backend in place of Http service for backend-less development
//     provide: HTTP_INTERCEPTORS,
//     useClass: FakeBackendInterceptor,
//     multi: true,
// };
