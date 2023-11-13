import { Component, inject, signal } from '@angular/core';
import {  } from '@angular/common';
import {
    RouterLink,
    RouterLinkActive,
    Router,
} from "@angular/router";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: "navbar-component",
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgbCollapseModule],
    templateUrl: "./navbar.component.html",
    styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
    private router = signal(inject(Router));
    private getRoutes = () =>
        this.router().config.filter(path => path.data?.["label"] != undefined);

    protected isMenuCollapsed = signal(true);
    protected routes = signal(this.getRoutes())
    // Arrow functions do not work inside templates
    protected toggleCollapsed = () => this.isMenuCollapsed.update(v => !v);

}
