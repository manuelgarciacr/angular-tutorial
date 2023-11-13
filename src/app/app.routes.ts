import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "home",
        loadComponent: () =>
            // Lazy load component
            import("./home").then(c => c.HomeComponent),
        data: { label: "Home" },
    },
    {
        path: "login",
        loadComponent: () => import("./account").then(c => c.LoginComponent),
        data: { label: "Login" },
    },
    {
        path: "register",
        loadComponent: () => import("./account").then(c => c.RegisterComponent),
        data: { label: "Register" }
    },

    // otherwise redirect to home or error page
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {
        path: "**",
        loadComponent: () =>
            import("./e404/e404.component").then(c => c.E404Component),
    },
];
