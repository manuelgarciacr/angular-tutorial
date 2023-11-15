/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@app';
import { AppComponent } from '@app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
