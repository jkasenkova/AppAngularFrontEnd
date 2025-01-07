import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ReportCommentsModel } from "src/app/models/reportCommentsModel";
import { UserService } from "src/app/services/userService";

@Component({
    selector: 'report-comments',
    standalone: true,
    imports: [
        CommonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl:'./report-comments.component.html',
    styleUrls: ['./report-comments.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class ReportCommentsComponent implements OnInit {
    @Input() reportComments: ReportCommentsModel[];

    constructor(
        private userService: UserService
      ) { }

      ngOnInit(): void {

      }

    getOwnerComment(userId: string): string {
        return "Julia Kasenkova"; // for test
    }
}