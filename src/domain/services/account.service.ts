import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BasicUser, IUser, LoggedUser } from '@domain';
import { environment } from "@environments";
import { UsersRepoService } from '@infrastructure';
import { BehaviorSubject, map, tap } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json",
        //"Referrer-Policy": "origin-when-cross-origin"
        //Authorization: 'my-auth-token',
    }),
    observe: "body" as const,
    params: {},
    reportProgress: false,
    responseType: "json" as const,
    withCredentials: false,
};

@Injectable({
    providedIn: "root",
})
export class AccountService {
    private repo = inject(UsersRepoService);
    private router = inject(Router);
    private http = inject(HttpClient);
    private _userSubject = new BehaviorSubject(
        JSON.parse(localStorage.getItem("user")!)
    );
    get userValue() {
        return this._userSubject.value;
    }
    private _user = this._userSubject.asObservable();
    get user$() {
        return this._user;
    }

    login = (username: string, password: string) =>
        this.http
            .post<LoggedUser>(
                `${environment.apiUrl}/users/authenticate`,
                {
                    username,
                    password,
                },
                httpOptions
            )
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("user", JSON.stringify(user));
                    this._userSubject.next(user);
                    return user;
                })
            );

    logout() {

        // remove user from local storage and set current user to null
        localStorage.removeItem("user");
        if (this._userSubject) this._userSubject.next(null);
        this.router.navigate(["login"]);
    }

    register(user: IUser) {

        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {

        //return this.http.get<BasicUser[]>(`${environment.apiUrl}/users`);
        return this.repo.getUsers("");
    }

    getById(id: string) {

        //return this.http.get<BasicUser>(`${environment.apiUrl}/users/${id}`);
        return this.repo.getOneUser(id);
    }

    update(id: number, newUser: Partial<IUser>) {

console.log("UDE", id, `/users/${id}`)
        //return this.http.put(`${environment.apiUrl}/users/${id}`, newUser).pipe(
        return this.repo.put(id.toString(), newUser).pipe(
            tap(() => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...newUser };
                    localStorage.setItem("user", JSON.stringify(user));

                    // publish updated user to subscribers
                    this._userSubject.next(user);
                }
            })
        );
    }

    delete(id: number) {

        //return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
        return this.repo.delete(id.toString()).pipe(
            tap(() => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    this.logout();
                }
            })
        );
    }
}


