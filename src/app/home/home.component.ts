import { Component, inject } from '@angular/core';
import { AccountService } from '@domain';

@Component({
    // Router pages don't need selector, but angular 17 shows a warning. Generates
    //   duplicate internal IDs in components that appear duplicated.
    selector: "home-component",
    standalone: true,
    imports: [],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {
    private accountService = inject(AccountService);
    protected user = this.accountService.userValue;
}
