import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../../../services/topicService';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { CustomHeader } from './custom-header.component';

@Component({
    selector: 'app-template-topic',
    standalone: true,
    imports: [AgGridAngular, CustomHeader],
    templateUrl: './template-topic.component.html',
    styleUrls: ['./template-topic.component.less']
})
export class TemplateTopicComponent implements OnInit {
    public paginationPageSize = 10;
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    frameworkComponents: any;

    colDefs: ColDef[] = [
        {
            field: "topic",
            width: 360,
            resizable: false,
            cellClass: "line-col",
            headerComponent: CustomHeader
        },
        {
            field: "reference",
            width: 360,
            resizable: false,
            cellClass: "line-col"
        },
        {
            field: "template",
            width: 360,
            resizable: false
        }
    ];

    rowData = [
        { topic: "aaaa", reference: "aaaa", template: "aaaa" },
        { topic: "bbbb", reference: "bbbb", template: "bbbb" },
        { topic: "cccc", reference: "cccc", template: "cccc" }
    ];


  constructor(private topicService: TopicService) {}

  ngOnInit(): void {

  }
}
