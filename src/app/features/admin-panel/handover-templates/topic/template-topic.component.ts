import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SectionService } from 'src/app/services/sectionService';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Section } from 'src/app/models/section';
import { Guid } from 'guid-typescript';
import { UpdateTemplateService } from 'src/app/services/updateTemplateService';
import { DeleteTemplateTopicDialogComponent } from './template-topic-dialog/delete-template-topic/delete-template-topic-dialog.component';
import { UpdateTemplateTopicService } from 'src/app/services/updateTemplateTopicService';

@Component({
    selector: 'app-template-topic',
    standalone: true,
    imports: [
        AgGridAngular, 
        MatButtonModule,
        NgbModule,
        FormsModule,
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './template-topic.component.html',
    styleUrls: ['./template-topic.component.less']
})
export class TemplateTopicComponent implements OnInit, OnChanges{
    public paginationPageSize = 10;
    templatesList: Template[];
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    templateTopicList: TemplateTopic[];
    readonly dialog = inject(MatDialog);
    @Input() displayDataRow: TopicDataModel[] = [];

    searchTopicTerm: string = '';
    searchRefTerm: string = '';
    searchSectionTerm: string = '';
    searchTemplateTerm: string = '';
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
    private updateTemplateTopicService: UpdateTemplateTopicService,
    private templatTopicService: TemplateTopicService,
    private topicService: TemplateTopicService, 
    private sectionService: SectionService,
    private templateReferenceService: TemplateReferenceService,
    private updateTemplateService: UpdateTemplateService) 
    {
        debugger; // need check!!
        this.templatesList = this.updateTemplateService.getData() as Template [];
    }

  ngOnInit(): void {
    this.topicService.getTemplateTopics().subscribe(topics =>
    {
        this.templateTopicList = topics;
        this.updateTemplateTopicService.setData(topics);

        topics.map(topic => {
            topic.templateReferences.map(reference => {
                this.displayDataRow.push(
                {
                    templateTopicName: topic.name,
                    templateReferenceName: reference.name,
                    templateList: this.displayTemplatesName(topic),
                    sectionId: topic.sectionId,
                    topic: topic
                });
            });
        });

        this.sortData(this.displayDataRow);
        this.collectionSize = this.displayDataRow.length;
    });
 }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['displayDataRow']) {
            debugger;
            changes['data'].currentValue
        }
    }

 getSectionName(sectionId: Guid): Observable<string> {
    return this.sectionService.getSectionById(sectionId).pipe(
        map((response) => response.name),
        catchError((error) => {
          return of('-');
        })
      );
 }


  displayTemplatesName(topic: TemplateTopic): string {
    var templateArr: string[] = [];
    if(topic.parentTopicId)
    {
        this.topicService.getTemplateTopicById(topic.parentTopicId).pipe(
            map((responce) =>
            {
                if(this.templatesList != null)
                {
                    this.templatesList.forEach(template =>
                    {
                        if(template.sections != null && template.sections.length > 0){
                            if(template.sections.find(s => s.id == responce.sectionId) != null){
                                templateArr.push(template.name);
                            }
                        }
                    });
                }
               
            })
        )
    }
    if(topic.sectionId != null)
    {
        if(this.templatesList != null)
        {
            this.templatesList.forEach(template =>
            {
                if(template.sections != null && template.sections.length > 0){
                    if(template.sections.find(s => s.id == topic.sectionId) != null){
                        templateArr.push(template.name);
                    }
                }
            });
        }
        
    }
    return templateArr != null ? templateArr.join(",") : "-";
  }

  getTemplatesByTopic(topic: TemplateTopic): Template[] {
    var templateArr: Template[] = [];
    this.templatesList.forEach(template =>
    {
        if(template.sections != null && template.sections.length > 0){
            if(template.sections.find(s=>s.id == topic.sectionId) != null){
                templateArr.push(template);
            }
        }
    });

    return templateArr;
  }

  getTemplateTopics(): void{
    this.topicService.getTemplateTopicsBySectionId()
    .subscribe(value => this.templateTopicList = value);
  }

    addTemplateTopic(): void {
        const dialogRef = this.dialog.open(CreateTemplateTopicDialogComponent, { 
            data: { 
                templates: this.templatesList,
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

                       
                        this.templateReferenceService.addTemplateReference(newReference)
                        .subscribe(response => 
                        {
                            debugger;
                            newTopic.templateReferences = [];
                            newTopic.templateReferences.push(response);
                            this.updateTemplateTopicService.addItem(newTopic);
                            
                            this.displayDataRow.push(
                                {
                                    templateTopicName: topic.name,
                                    templateReferenceName: newReference.name,
                                    templateList: this.displayTemplatesName(topic),
                                    sectionId: topic.sectionId,
                                    topic: topic
                                });
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
                        templateList: this.displayTemplatesName(topic),
                        sectionId: topic.sectionId,
                        topic: topic
                    });
                }

               this.sortData(this.displayDataRow);
            }
        });
    }

    sortData(data: TopicDataModel[]){
        data = data.sort((a,b) => a.templateTopicName.localeCompare(b.templateTopicName));
    }

    deleteTopic(data: TopicDataModel){
        const dialogRef = this.dialog.open(DeleteTemplateTopicDialogComponent, { 
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.templatTopicService.deleteTemplateTopicById(result.templateTopicId);
                this.displayDataRow = this.displayDataRow.filter(t => t.templateTopicId != result.templateTopicId);
                debugger;
                this.updateTemplateTopicService.deleteItem(result);
            }
        });
    }

    editTopic(data: TopicDataModel){
        data.templates = this.templatesList;

        const dialogRef = this.dialog.open(EditTemplateTopicDialogComponent, { 
            data: {
                topicData: data,
                associatedTemplates: this.getTemplatesByTopic(data.topic)
            },
            panelClass: 'template-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                debugger;
                var updTopic = result.topic as TemplateTopic;
                if(result.selectedSection)
                {
                    updTopic.sectionId = result.selectedSection.id;
                }

                this.templatTopicService.updateTopic(updTopic);
            }
        });
    }

    searchTopic(){
        if(this.searchTopicTerm && this.searchTopicTerm.length > 0){
            
        }
    }
    searchReference(){

    }
    searchSection(){

    }
    searchTemlate(){

    }
}
