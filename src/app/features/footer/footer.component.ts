import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'footer',
    standalone: true,
    imports: [
    ],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class FooterComponent implements OnInit{
    currentYear: number;

    ngOnInit(): void {
         this.currentYear = new Date().getFullYear();
    }
}