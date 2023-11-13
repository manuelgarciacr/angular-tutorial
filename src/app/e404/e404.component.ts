import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    // Router pages do not need selector
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./e404.component.html",
    styleUrl: "./e404.component.scss",
})
export class E404Component {}
