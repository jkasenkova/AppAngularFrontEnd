import { Component, inject, OnInit } from '@angular/core';
import { TopicService } from '../../../../services/topicService';
import { AgGridAngular } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { TemplateTopic } from 'src/app/models/templateTopic';
import { ColDef } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreateTemplateTopicDialogComponent } from './template-topic-dialog/create-template-topic/create-template-topic-dialog.component';
import { EditButtonComponent } from './editButtonComponent';
import { Template } from 'src/app/models/template';
import { Guid } from 'guid-typescript';
import { DeleteButtonComponent } from './deleteButtonComponent';

@Component({
    selector: 'app-template-topic',
    standalone: true,
    imports: [AgGridAngular, MatButtonModule],
    templateUrl: './template-topic.component.html',
    styleUrls: ['./template-topic.component.less']
})
export class TemplateTopicComponent implements OnInit {
    public paginationPageSize = 10;
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    templateTopicList: TemplateTopic[];
    readonly dialog = inject(MatDialog);

    colDefs: ColDef[] = [
        {
            field: "topic",
            width: 260,
            resizable: false,
            cellClass: "line-col"
        },
        {
            field: "reference",
            width: 260,
            resizable: false,
            cellClass: "line-col"
        },
        {
            field: "template",
            width: 360,
            resizable: false
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            resizable: false,
            cellRenderer: EditButtonComponent 
        },
        {
            field: "actions",
            headerName: "",
            width: 110,
            resizable: false,
            cellRenderer: DeleteButtonComponent 
        }
    ];

    templateListTemp: Template[] = [
        {
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            templateName: "Template 1",
            isHandoverTemplate: false,
            sections: []
        },
        {
            templateId: Guid.parse("92e15cb3-e13d-4c02-8622-483ac0bf89c2"),
            templateName: "Template 2",
            isHandoverTemplate: false,
            sections: []
        },
    ];

    rowData = [
        { topic: "aaaa", reference: "aaaa", template: "aaaa", editable: true, templates:this.templateListTemp},
        { topic: "bbbb", reference: "bbbb", template: "bbbb", editable: true, templates:this.templateListTemp},
        { topic: "cccc", reference: "cccc", template: "cccc", editable: true, templates:this.templateListTemp}
    ];


  constructor(private topicService: TopicService) {}

  ngOnInit(): void {
  }

  getTemplateTopics(): void{
    this.topicService.getTemplateTopicList()
    .subscribe(value => this.templateTopicList = value);
  }

    addTemplateTopic(): void {
        const dialogRef = this.dialog.open(CreateTemplateTopicDialogComponent, { 
            data: { 
                templateTopicName: '', 
                templateReferenceName: '', 
                templateDescription: '', 
                templates: this.templateListTemp },
            panelClass: 'template-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}
