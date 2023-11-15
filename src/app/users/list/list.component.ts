import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService, BasicUser } from '@domain';
import { first } from 'rxjs';

@Component({
    selector: "users-list-component",
    standalone: true,
    imports: [RouterLink, NgIf],
    templateUrl: "./list.component.html",
    styleUrl: "./list.component.scss",
})
export class UsersListComponent implements OnInit {
    private accountService = inject(AccountService);
    protected users!: (BasicUser & {isDeleting: boolean})[];

    ngOnInit() {
        this.accountService
            .getAll()
            .pipe(first())
            .subscribe(users => (this.users = users.map(v => ({...v, isDeleting: false}))));
    }

    deleteUser(id: number) {
        const user = this.users!.find(v => v.id === id);

        user!.isDeleting = true;
        this.accountService
            .delete(id)
            .pipe(first())
            .subscribe(
                () => (this.users = this.users!.filter(v => v.id !== id))
            );
    }
}
