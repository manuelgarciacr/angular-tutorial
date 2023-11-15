import { Injectable, OnInit, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Alert } from '@domain';
import { Observable, Subject, startWith } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class AlertService implements OnInit {
    private router = inject(Router);
    private alert$ = new Subject<Alert | null>()
    private showAfterRedirect = false;

    ngOnInit(): void {
        // clear alert messages on route change unless 'showAfterRedirect' flag is true
        this.router.events.subscribe(event => {
            if (!(event instanceof NavigationStart)) return;

            if (this.showAfterRedirect) {
                // only keep for a single route change
                this.showAfterRedirect = false;
            } else {
                // clear alert message
                this.clear();
            }
        });
    }

    onAlert$(): Observable<any> {
        return this.alert$.asObservable();
    }

    success(message: string, showAfterRedirect = false) {
        this.showAfterRedirect = showAfterRedirect;
        this.alert$.next({ type: "success", message });
    }

    error(message: string, showAfterRedirect = false) {
        this.showAfterRedirect = showAfterRedirect;
        this.alert$.next({ type: "error", message });
    }

    clear() {
        // clear by calling subject.next() with null
        this.alert$.next(null);
    }
}
