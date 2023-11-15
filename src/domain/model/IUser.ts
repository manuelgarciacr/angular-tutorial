export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export type BasicUser = Omit<IUser, "password">;

export type LoggedUser = BasicUser & { token: string };
