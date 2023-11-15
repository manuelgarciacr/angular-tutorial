import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService, LoggedUser } from '@domain';
import { NavbarComponent } from '@infrastructure';

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    protected accountService = inject(AccountService);
    user?: LoggedUser | null;

    constructor() {
        this.accountService.user$.subscribe(x => (this.user = x));
    }
}
