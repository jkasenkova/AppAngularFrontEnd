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
import { TopicDataModel } from './model/topicDataModel';
import { Reference } from 'src/app/models/reference';
import { TemplateReferenceService } from 'src/app/services/templateReferenceService';
import { DisplayDataRowModel } from './model/displaDataRowModel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import '@angular/localize/init'
import { EditTemplateTopicDialogComponent } from './template-topic-dialog/edit-template-topic/edit-template-topic-dialog.component';

@Component({
    selector: 'app-template-topic',
    standalone: true,
    imports: [
        AgGridAngular, 
        MatButtonModule,
        NgbModule,
        FormsModule,
        CommonModule
    ],
    templateUrl: './template-topic.component.html',
    styleUrls: ['./template-topic.component.less']
})
export class TemplateTopicComponent implements OnInit {
    public paginationPageSize = 10;
    templatesList: Template[];
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    templateTopicList: TemplateTopic[];
    topicsData: TopicDataModel[] = [];
    readonly dialog = inject(MatDialog);
    noRowsDisplay: string = "No topics data to show";
    displayDataRow: TopicDataModel[] = [];
    rowData: TopicDataModel[] = [];

    searchTerm: string = '';
    page = 1;
    pageSize = 5;
    collectionSize: number = 100;
    currentRate = 8;
    
    colDefs: ColDef[] = [
        {
            field: "topic",
            width: 260,
            resizable: false,
            sortable: true,
            cellClass: "line-col"
        },
        {
            field: "reference",
            width: 260,
            resizable: false,
            sortable: true,
            cellClass: "line-col"
        },
        {
            field: "section",
            width: 360,
            sortable: true,
            resizable: false
        },
        {
            field: "template",
            width: 360,
            sortable: true,
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
    private templateReferenceService: TemplateReferenceService,
    private templateService: TemplateService) {
    }

  ngOnInit(): void {
     this.templateService.getTemplates().subscribe(templates =>
        this.templatesList = templates
    );
    
    this.topicService.getTemplateTopics().subscribe(topics =>{
        this.templateTopicList = topics;

        topics.map(topic => {
            topic.templateReferences.map(reference => {
                this.displayDataRow.push(
                {
                    templateTopicName: topic.name,
                    templateReferenceName: reference.name,
                    sectionName: "Section 1",
                    templateList: "Template 1",
                    sectionId: topic.sectionId
                });
            });
        });

        this.rowData =  this.displayDataRow;
        this.sortData(this.displayDataRow);
        this.collectionSize = this.displayDataRow.length;
    });
 }
   

  displayTemplatesName(templates:Template[]): string {
    return templates.flatMap(t => t.name).toString();
  }

  getTemplateTopics(): void{
    this.topicService.getTemplateTopicsBySectionId()
    .subscribe(value => this.templateTopicList = value);
  }

    addTemplateTopic(): void {
        const dialogRef = this.dialog.open(CreateTemplateTopicDialogComponent, { 
            data: { 
                templateTopicName: '', 
                templateReferenceName: '', 
                templateDescription: '', 
                templates: this.templatesList ,
                topics: this.templateTopicList
            },
            panelClass: 'template-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if(result.templateTopicId == null)
                {
                    var topic: TemplateTopic = {
                        name: result.templateTopicName,
                        enabled: result.sectionId ? true : false,
                        index: 0,
                        editing: false,
                        isExpand: false,
                        sectionId: result.sectionId,
                        templateReferences: []
                    }
                    this.topicService.addTemplateTopic(topic).subscribe(newTopic =>
                    {
                        var newReference: Reference = {
                            name: result.templateReferenceName,
                            enabled: result.sectionId ? true : false,
                            index: 0,
                            description: result.templateDescription,
                            editing: false,
                            templateTopicId: newTopic.id,
                            expand: false
                        };
                        this.templateReferenceService.addTemplateReference(newReference);

                        this.displayDataRow.push(
                        {
                            templateTopicName: topic.name,
                            templateReferenceName: newReference.name,
                            sectionName: "-",
                            templateList: "-",
                            sectionId: topic.sectionId
                        });
                    });
                }
                else
                {
                    var newReference: Reference = {
                        name: result.templateReferenceName,
                        enabled: result.sectionId ? true : false,
                        index: 0,
                        description: result.templateDescription,
                        editing: false,
                        templateTopicId: result.templateTopicId,
                        expand: false
                    };

                    this.templateReferenceService.addTemplateReference(newReference);

                    this.displayDataRow.push(
                    {
                        templateTopicName: topic.name,
                        templateReferenceName: newReference.name,
                        sectionName: "-",
                        templateList: "-",
                        sectionId: topic.sectionId
                    });
                }

               this.sortData(this.displayDataRow);
            }
        });
    }

    search(event: any): void {
        const searchFilter = event.target?.value;
        if(searchFilter != "")
        {
            this.displayDataRow = this.displayDataRow.filter((val) =>
                val.templateTopicName.toLowerCase().includes(searchFilter));
            this.collectionSize = this.displayDataRow.length;
        }
        else{
            this.displayDataRow = this.rowData;
        }
    }

    sortData(data: TopicDataModel[]){
        data = data.sort((a,b) => a.templateTopicName.localeCompare(b.templateTopicName));
    }

    deleteTopic(data: TopicDataModel){

    }

    editTopic(data: TopicDataModel){
        data.templates = this.templatesList;
        const dialogRef = this.dialog.open(EditTemplateTopicDialogComponent, { 
            data: data,
            panelClass: 'template-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }
}
