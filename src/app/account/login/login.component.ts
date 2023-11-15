import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "@domain";
import { first } from "rxjs";

@Component({
    /// Router pages don't need selector, but angular 17 shows a warning. Generates
    //   duplicate internal IDs in components that appear duplicated.
    selector: "login-component",
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    protected fg!: FormGroup;
    protected loading = false;
    protected submitted = false;
    protected error?: string;

    constructor() {
        // redirect to home if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(["/"]);
        }
    }

    ngOnInit() {
        this.fg = this.formBuilder.group({
            username: ["", Validators.required],
            password: ["", Validators.required],
        });
    }

    onSubmit() {
        this.submitted = true;

        // reset alert on submit
        this.error = "";

        // stop here if form is invalid
        if (this.fg.invalid) {
            return;
        }

        this.loading = true;

        this.accountService
            .login(
                this.fg.get("username")!.value,
                this.fg.get("password")!.value
            )
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from query parameters or default to home page
                    const returnUrl =
                        this.route.snapshot.queryParams["returnUrl"] || "/";
                    this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                },
                complete() {
                    // console.log("done");
                },
            });
    }
}
