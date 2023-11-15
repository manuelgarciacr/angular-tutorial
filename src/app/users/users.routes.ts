import { Routes } from "@angular/router";
//import { authGuard } from "@infrastructure";

export const usersRoutes: Routes = [
    {
        path: "",
        loadComponent: () =>
            // Lazy load component
            import("@app").then(c => c.UsersListComponent),
        //data: { label: "Home" },
        //canActivate: [authGuard],
    },
    {
        path: "add",
        loadComponent: () => import("@app").then(c => c.UsersAddEditComponent),
        //data: { label: "Login" },
    },
    {
        path: "edit/:id",
        loadComponent: () => import("@app").then(c => c.UsersAddEditComponent),
        //data: { label: "Register" },
    },
 ];
