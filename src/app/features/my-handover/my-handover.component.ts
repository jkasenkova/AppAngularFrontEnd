import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-my-handover',
    standalone: true,
    imports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-handover.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MyHandoverComponent implements OnInit {

    ngOnInit(): void {
    }
}