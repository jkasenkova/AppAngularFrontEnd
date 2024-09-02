import { Component, inject, OnInit } from '@angular/core';
import { TopicService } from '../../../../services/topicService';
import { AgGridAngular } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { TemplateTopic } from 'src/app/models/templateTopic';
import { ColDef, GridReadyEvent } from "ag-grid-community";
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
            sections:  [
                {
                    templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "Section 1",
                    iHandoverSection: false
                },
                {
                    templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "Section 2",
                    iHandoverSection: false
                }
            ]
        },
        {
            templateId: Guid.parse("92e15cb3-e13d-4c02-8622-483ac0bf89c2"),
            templateName: "Template 2",
            isHandoverTemplate: false,
            sections:  [
                {
                    templateId: Guid.parse("92e15cb3-e13d-4c02-8622-483ac0bf89c2"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "AAA",
                    iHandoverSection: false
                },
                {
                    templateId: Guid.parse("92e15cb3-e13d-4c02-8622-483ac0bf89c2"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "BBB",
                    iHandoverSection: false
                }
            ]
        },
        {
            templateId: Guid.parse("3f7754ec-fc6c-4ee8-95bf-8b8fe3e7c94e"),
            templateName: "Template 3",
            isHandoverTemplate: false,
            sections:  [
                {
                    templateId: Guid.parse("3f7754ec-fc6c-4ee8-95bf-8b8fe3e7c94e"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "Round 1",
                    iHandoverSection: false
                },
                {
                    templateId: Guid.parse("3f7754ec-fc6c-4ee8-95bf-8b8fe3e7c94e"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "Round 2",
                    iHandoverSection: false
                }
            ]
        },
        {
            templateId: Guid.parse("cb8ce69d-443d-40b3-92d3-68a36594785b"),
            templateName: "Template 4",
            isHandoverTemplate: false,
            sections:  [
                {
                    templateId: Guid.parse("cb8ce69d-443d-40b3-92d3-68a36594785b"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "HSE",
                    iHandoverSection: false
                },
                {
                    templateId: Guid.parse("cb8ce69d-443d-40b3-92d3-68a36594785b"),
                    sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                    sectionName: "Core",
                    iHandoverSection: false
                }
            ]
        }
    ];

    rowData = [
        { 
            topic: "aaaa", 
            reference: "aaaa", 
            template: this.displayTemplatesName(this.templateListTemp.filter(t=>t.templateName != "Template 3" && t.templateName != "Template 4")),
            associatedTemplates: this.templateListTemp.filter(t=>t.templateName != "Template 3" && t.templateName != "Template 4"), 
            editable: true, 
            templates: this.templateListTemp, 
            topicId: Guid.parse("11dbdd41-fa7d-4b30-b16d-9f1b9a1cbce1"),
            description: "aaaa" 
        },
        { 
            topic: "bbbb", 
            reference: "bbbb", 
            template: this.displayTemplatesName(this.templateListTemp.filter(t=>t.templateName != "Template 1" && t.templateName != "Template 2")), 
            description: "bbbb", 
            editable: true, 
            topicId: Guid.parse("ad5fb615-d4e2-423f-a77d-a1e4740381ed"),
            associatedTemplates: this.templateListTemp.filter(t=>t.templateName != "Template 1" && t.templateName != "Template 2"), 
            templates:this.templateListTemp
        },
        { 
            topic: "cccc", 
            reference: "cccc", 
            template: this.displayTemplatesName(this.templateListTemp.filter(t=>t.templateName != "Template 2")),
            description: "cccc",
            editable: true, 
            topicId: Guid.parse("22e80094-f1b5-433a-85f8-baf26ee44fc9"),
            associatedTemplates: this.templateListTemp.filter(t=>t.templateName != "Template 2"), 
            templates:this.templateListTemp
        },
        { 
            topic: "dddd", 
            reference: "dddd", 
            template: "-",
            description: "dddd",
            editable: true, 
            topicId: Guid.parse("3d21b769-4a75-45dc-ab51-d0afed107845"),
            associatedTemplates: null, 
            templates: this.templateListTemp
        }
    ];


  constructor(private topicService: TopicService) {}

  ngOnInit(): void {
  }

  displayTemplatesName(templates:Template[]): string {
    return templates.flatMap(t=>t.templateName).toString();
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
