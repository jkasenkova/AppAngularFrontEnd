import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { HandoverSection } from "src/app/models/handoverSection";
import { pdfDisplayTopicsModel } from "../../models/pdfDisplayTopicsModel";

@Component({
    selector: 'topic-model',
    standalone: true,
    imports: [
        CommonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl:'./topic-model.component.html',
    styleUrls: ['./topic-model.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class TopicModelComponent implements OnInit {
    @Input() sectionsOut: HandoverSection[];

    ngOnInit(): void {
    }
}