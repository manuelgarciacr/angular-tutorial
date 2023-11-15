export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export type LoggedUser = Omit<IUser, "password"> & { token: string };
