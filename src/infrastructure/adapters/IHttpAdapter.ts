import { Observable } from "rxjs";

// export type resp<T> = {
//     status: number,
//     message: string,
//     data: T[]
// }

export type Params = {
    [param: string]: string | number | boolean | readonly (string | number | boolean)[];
};

export interface IHttpAdapter<T> {
    url: string;

    getSome: (arg: "" | Params) => Observable<T[]>; // Get zero or more
    getOne: (id: string) => Observable<T>; // Get zero or one
    put: (id: string, data: Partial<T>) => Observable<T>; // Actualize zero or one
    delete: (id: string) => Observable<T>; // Delete zero or one
}

// getUsers = (arg?: Params) => this.dataSource.getSome(arg);
// getOneUser = (id: string) => this.dataSource.getOne(id);
// put = (user: IUser) => this.dataSource.put(user);
