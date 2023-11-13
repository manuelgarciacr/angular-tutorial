import { Component } from '@angular/core';
import {  } from '@angular/common';

@Component({
    // Router pages don't need selector, but angular 17 shows a warning. Generates
    //   duplicate internal IDs in components that appear duplicated.
    selector: "register-component",
    standalone: true,
    imports: [],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
})
export class RegisterComponent {}
