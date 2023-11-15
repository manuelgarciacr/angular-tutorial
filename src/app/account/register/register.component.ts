import { Component, OnInit, inject } from '@angular/core';
import { NgIf } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService, AlertService } from '@domain';
import { first } from 'rxjs';

@Component({
    // Router pages don't need selector, but angular 17 shows a warning. Generates
    //   duplicate internal IDs in components that appear duplicated.
    selector: "register-component",
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
})
export class RegisterComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);
    protected fg!: FormGroup;
    protected loading = false;
    protected submitted = false;

    constructor() {
        // redirect to home if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(["/"]);
        }
    }

    ngOnInit() {
        this.fg = this.formBuilder.group({
            firstName: ["", Validators.required],
            lastName: ["", Validators.required],
            username: ["", Validators.required],
            password: ["", [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit() {
        this.submitted = true;

        // reset alert on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.fg.invalid) {
            return;
        }

        this.loading = true;

        this.accountService
            .register(this.fg.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success("Registration successful", true);
                    this.router.navigate(["/login"], {
                        queryParams: { registered: true },
                    });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                },
                complete() {
                    // console.log("done");
                },
            });
    }

    getVal = (ctrlName: string) => this.fg.get(ctrlName)!.value;
}
