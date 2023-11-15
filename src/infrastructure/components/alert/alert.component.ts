import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from '@domain';

@Component({
    selector: "alert-component",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./alert.component.html",
    styleUrl: "./alert.component.scss",
})
export class AlertComponent implements OnInit, OnDestroy {
    private alertService = inject(AlertService);
    private alertSubscription!: Subscription;
    protected alert: Alert & {cssClass: string} | null = null;

    ngOnInit() {
        this.alertSubscription = this.alertService
            .onAlert$()
            .subscribe(alert => {
                switch (alert?.type) {
                    case "success":
                        alert.cssClass = "alert alert-success";
                        break;
                    case "error":
                        alert.cssClass = "alert alert-danger";
                        break;
                }

                this.alert = alert;
            });
    }

    ngOnDestroy() {
        this.alertSubscription.unsubscribe();
    }
}
