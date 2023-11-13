import { Component } from "@angular/core";
import {} from "@angular/common";

@Component({
    /// Router pages don't need selector, but angular 17 shows a warning. Generates
    //   duplicate internal IDs in components that appear duplicated.
    selector: "login-component",
    standalone: true,
    imports: [],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent {}
