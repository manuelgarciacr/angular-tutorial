import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService, AlertService } from '@domain';
import { first } from 'rxjs';

@Component({
    selector: "users-add-edit-component",
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: "./add-edit.component.html",
    styleUrl: "./add-edit.component.scss",
})
export class UsersAddEditComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private alertService = inject(AlertService);
    protected fg!: FormGroup;
    protected id?: string;
    protected title!: string;
    protected loading = false;
    protected submitting = false;
    protected submitted = false;

    ngOnInit() {
        this.id = this.route.snapshot.params["id"];

        // form with validation rules
        this.fg = this.formBuilder.group({
            firstName: ["", Validators.required],
            lastName: ["", Validators.required],
            username: ["", Validators.required],
            // password only required in add mode
            password: [
                "",
                [
                    Validators.minLength(6),
                    ...(!this.id ? [Validators.required] : []),
                ],
            ],
        });

        this.title = "Add User";
        if (this.id) {
            // edit mode
            this.title = "Edit User";
            this.loading = true;
            this.accountService
                .getById(this.id)
                .pipe(first())
                .subscribe(v => {
                    this.fg.patchValue(v);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form values
    protected getVal = (ctrlName: string) => this.fg.get(ctrlName)!.value;

    protected onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.fg.invalid) {
            return;
        }

        this.submitting = true;
        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success("User saved", true);
                    this.router.navigateByUrl("/users");
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                },
            });
    }

    private saveUser() {
        // create or update user based on id param
        return this.id
            ? this.accountService.update(parseInt(this.id!), this.fg.value)
            : this.accountService.register(this.fg.value);
    }
}
