import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpAdapter, errorInterceptor, fakeBackendInterceptor, jwtInterceptor } from '@infrastructure';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // fakeBackendProvider,
        // importProvidersFrom(HttpClientModule),
        provideHttpClient(
            withInterceptors([
                jwtInterceptor,
                errorInterceptor,
                fakeBackendInterceptor,
                // // fake backend
                // fakeBackendInterceptor,
            ])
        ),
        HttpAdapter
    ],
};
