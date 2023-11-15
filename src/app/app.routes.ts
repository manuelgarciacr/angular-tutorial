import { Routes } from '@angular/router';
import { authGuard } from '@infrastructure';

export const routes: Routes = [
    {
        path: "home",
        loadComponent: () =>
            // Lazy load component
            import("@app").then(c => c.HomeComponent),
        data: { label: "Home" },
        canActivate: [authGuard],
    },
    {
        path: "login",
        loadComponent: () => import("@app").then(c => c.LoginComponent),
        data: { label: "Login" },
    },
    {
        path: "register",
        loadComponent: () => import("@app").then(c => c.RegisterComponent),
        data: { label: "Register" },
    },
    // otherwise redirect to home or error page
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {
        path: "**",
        loadComponent: () => import("@app").then(c => c.E404Component),
    },
];
