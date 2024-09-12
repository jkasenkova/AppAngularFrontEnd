import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-my-team',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-team.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MyTeamComponent implements OnInit {
   
    ngOnInit(): void {
    }

}