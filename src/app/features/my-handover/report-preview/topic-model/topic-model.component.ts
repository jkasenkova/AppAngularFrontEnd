import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { RotationSection } from "src/app/models/handoverSection";

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
    @Input() sectionsOut: RotationSection[];

    ngOnInit(): void {
    }
}