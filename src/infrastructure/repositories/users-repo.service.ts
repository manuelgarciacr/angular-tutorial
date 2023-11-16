import { Injectable, inject } from "@angular/core";
import { IHttpAdapter, Params } from "@infrastructure";
import { environment } from "@environments";
import { HttpAdapter } from "@infrastructure";
import { IUser } from "@domain";
//import { IResponse } from "src/domain/model/IResponse";

@Injectable({
    providedIn: "root",
})
export class UsersRepoService {
    private dataSource: IHttpAdapter<IUser>;

    constructor() {
        // All Http adapters must implement IHttpAdapter
        // It is possible to change the connection technology to another such
        //   as XMLHttpRequest, fetch, Axios, etc. and I would only need
        //   modify the HttpAdapter.
        this.dataSource = inject(HttpAdapter<IUser>);
        // URL obtained from environment variables.
        this.dataSource.url = `${environment.apiUrl}/users`;
    }

    getUsers = (arg: "" | Params) => this.dataSource.getSome(arg);
    getOneUser = (id: string) => this.dataSource.getOne(id);
    put = (id: string, user: Partial<IUser>) => this.dataSource.put(id, user);
    delete = (id: string) => this.dataSource.delete(id);
    login = (user: string, password: string) => this.dataSource.login(user, password);
    // getUsers = (arg?: string | Params) => this.dataSource.get(arg);
    // putUser = (user: IUser) => this.dataSource.put(user);
    // addUser = (user: IUser) => this.dataSource.post(user);
    // deleteUser = (id: string) => this.dataSource.delete(id);
}
