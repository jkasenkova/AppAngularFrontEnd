import { Component, inject, OnInit } from '@angular/core';
import { TemplateTopicService } from '../../../../services/templateTopicService';
import { AgGridAngular } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { TemplateTopic } from 'src/app/models/templateTopic';
import { ColDef } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreateTemplateTopicDialogComponent } from './template-topic-dialog/create-template-topic/create-template-topic-dialog.component';
import { EditButtonComponent } from './editButtonComponent';
import { Template } from 'src/app/models/template';
import { DeleteButtonComponent } from './deleteButtonComponent';
import { TemplateService } from 'src/app/services/templateService';
import { TemplateTopicDialogModel } from './model/templateTopicDialogModel';

@Component({
    selector: 'app-template-topic',
    standalone: true,
    imports: [AgGridAngular, MatButtonModule],
    templateUrl: './template-topic.component.html',
    styleUrls: ['./template-topic.component.less']
})
export class TemplateTopicComponent implements OnInit {
    public paginationPageSize = 10;
    templatesList: Template[];
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    templateTopicList: TemplateTopic[];
    topicsData: TemplateTopicDialogModel[] = [];
    readonly dialog = inject(MatDialog);
    noRowsDisplay: string = "No topics data to show";

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

  constructor(
    private topicService: TemplateTopicService, 
    private templateService: TemplateService) {
    }

  ngOnInit(): void {
    this.templateService.getTemplates().subscribe(templates =>
        this.templatesList = templates
    );

    this.topicService.getTemplateTopicList().subscribe(topics =>
        this.templateTopicList = topics
    );

    if( this.templateTopicList != undefined ){
        this.templateTopicList.map(topic => {
            topic.references.map(reference => {
                this.topicsData.push(
                    {
                        templateTopicName: topic.name, 
                        templateTopicId: topic.id,
                        templateReferenceName: reference.name, 
                        templateReferenceId: reference.id,
                        templateDescription: reference.description,
                        sectionId: topic.sectionId,
                        templates: this.templatesList
                    });
            });
        });
    }
   }

  displayTemplatesName(templates:Template[]): string {
    return templates.flatMap(t => t.templateName).toString();
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
                templates: this.templatesList 
            },
            panelClass: 'template-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.topicService.addTemplateTopic(result);
            }
        });
    }
}
