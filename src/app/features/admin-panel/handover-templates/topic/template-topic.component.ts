import { Component, inject, Input, OnInit } from '@angular/core';
import { TemplateTopicService } from '../../../../services/templateTopicService';
import { AgGridAngular } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { TemplateTopic } from 'src/app/models/templateTopic';
import { MatDialog } from '@angular/material/dialog';
import { CreateTemplateTopicDialogComponent } from './template-topic-dialog/create-template-topic/create-template-topic-dialog.component';
import { Template } from 'src/app/models/template';
import { TopicDataModel } from './model/topicDataModel';
import { Reference } from 'src/app/models/reference';
import { TemplateReferenceService } from 'src/app/services/templateReferenceService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import '@angular/localize/init';
import { EditTemplateTopicDialogComponent } from './template-topic-dialog/edit-template-topic/edit-template-topic-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SectionService } from 'src/app/services/sectionService';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteTemplateTopicDialogComponent } from './template-topic-dialog/delete-template-topic/delete-template-topic-dialog.component';
import { TemplateManagementService } from 'src/app/features/admin-panel/handover-templates/template/services/templateManagementService';
import { TemplateTopicManagementService } from './services/templateTopicManagementService';

@Component({
    selector: 'app-template-topic',
    standalone: true,
    imports: [
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
export class TemplateTopicComponent implements OnInit {
    public paginationPageSize = 10;
    templatesList: Template[];
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    templateTopicList: TemplateTopic[];
    readonly dialog = inject(MatDialog);
    @Input() displayDataTemplateTopic: TopicDataModel[] = [];

    page = 1;
    pageSize = 5;
    collectionSize: number;
    currentRate = 8;

    templateTopics$ = this.updateTemplateTopicService.templateTopics$;
    
  constructor(
    private updateTemplateTopicService: TemplateTopicManagementService,
    private templateService: TemplateManagementService,
    private templateTopicService: TemplateTopicService, 
    private templateReferenceService: TemplateReferenceService) 
    {
        this.updateTemplateTopicService.arrayChanged.subscribe((newTopicArray) => 
        {
            if(this.templateTopicList.length != newTopicArray.length ||
                this.templateTopicList.map(subArray => subArray.templateReferences.length) != 
                newTopicArray.map(subArray => subArray.templateReferences.length)
            )
            {
                this.displayDataTemplateTopic = this.initTemplateTopicData(newTopicArray);
        
                this.templateTopicList = newTopicArray;
                this.sortData(this.displayDataTemplateTopic);
                this.collectionSize = this.displayDataTemplateTopic.length;
            }
        });

        this.templateService.arrayChanged.subscribe(templateArr => this.templatesList = templateArr); 
    }

 ngOnInit(): void {
    this.templateTopicService.getTemplateTopics().subscribe(topics =>
    {
        this.templateTopicList = topics;
        this.updateTemplateTopicService.setData(topics);
        this.displayDataTemplateTopic = this.initTemplateTopicData(topics);
    });
  }

   initTemplateTopicData(templateTopics: TemplateTopic[]): TopicDataModel[] {
    var resultTopicDisplayData:TopicDataModel[] = [];
    templateTopics.map(topic => 
    {
        topic.templateReferences.map(reference => 
        {
            resultTopicDisplayData.push(
            {
                templateTopic: topic,
                templateReference: reference,
                templateList: this.displayTemplatesName(topic)
            });
        });
    });

    this.sortData(resultTopicDisplayData);
    this.collectionSize = resultTopicDisplayData.length;

    return resultTopicDisplayData;
  }

  displayTemplatesName(topic: TemplateTopic): string {
    var templateArr: string[] = [];

    if(topic.parentTopicId)
    {
        this.templateTopicService.getTemplateTopicById(topic.parentTopicId).subscribe(
        {
            next: (templateTopic) => {
                if(templateTopic.sectionId)
                {
                    var template = this.templatesList.find(t => t.sections.some(section => section.id === templateTopic.sectionId));

                    return template != null ? template.name : "-";
                }
                 else 
                 return  "-";      
            },
            error: (error) => {
                console.error('Error fetching data:', error);
            }
        });
    }
    if(topic.sectionId != null)
    {
        if(topic.sectionId)
        {
            var template = this.templatesList.find(t => t.sections.some(section => section.id === topic.sectionId));

            return template != null ? template.name : "-";
        } 
    }
    return templateArr != null ? templateArr.join(",") : "-";
  }

  getTemplatesByTopic(topic: TemplateTopic): Template[] {
    var templateArr: Template[] = [];

    this.templatesList.forEach(template =>
    {
        if(template.sections != null && template.sections.length > 0)
        {
            if(template.sections.some(item => item.id === topic.sectionId))
            {
                templateArr.push(template);
            }
        }
    });

    return templateArr;
  }
  
  sortData(data: TopicDataModel[]){
    data = data.sort((a,b) => a.templateTopic.name.localeCompare(b.templateTopic.name));
  }
  ///------------Topic Dialog-------------------------------
    addTemplateTopic(): void {
        const dialogRef = this.dialog.open(CreateTemplateTopicDialogComponent, 
        { 
            data: 
            { 
                templates: this.templatesList,
                topics: this.templateTopicList
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) 
            {
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
                    this.templateTopicService.addTemplateTopic(topic).subscribe(newTopic =>
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
                        newTopic.templateReferences = [];
                        newTopic.templateReferences.push(newReference);

                        this.updateTemplateTopicService.addItem(newTopic);
                        
                        this.displayDataTemplateTopic.push(
                        {
                            templateTopic: topic,
                            templateReference: newReference,
                            templateList: this.displayTemplatesName(topic)
                        });

                        this.collectionSize = this.displayDataTemplateTopic.length;
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
                    
                    this.displayDataTemplateTopic.push(
                    {
                        templateTopic: topic,
                        templateReference: newReference,
                        templateList: this.displayTemplatesName(topic)
                    });
                }
                this.collectionSize = this.displayDataTemplateTopic.length;
               this.sortData(this.displayDataTemplateTopic);
            }
        });
    }

    deleteTopic(data: TopicDataModel){
        const dialogRef = this.dialog.open(DeleteTemplateTopicDialogComponent, { 
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.templateTopicService.deleteTemplateTopicById(result.templateTopicId);

                let index = this.displayDataTemplateTopic.findIndex(d => d.templateTopic.id === result.templateTopicId);
                this.displayDataTemplateTopic.splice(index, 1);
                this.updateTemplateTopicService.deleteItem(data);

                this.collectionSize = this.displayDataTemplateTopic.length;
            }
        });
    }

    editTopic(data: TopicDataModel){
        data.templates = this.templatesList;
        const dialogRef = this.dialog.open(EditTemplateTopicDialogComponent, { 
            data: {
                topicData: data,
                associatedTemplates: this.getTemplatesByTopic(data.templateTopic)
            },
            panelClass: 'template-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var updTopic = result.topic as TemplateTopic;

                if(result.selectedSection != null)
                {
                    updTopic.sectionId = result.selectedSection.id;
                    updTopic.enabled = result.selectedSection.id != null ? true : false;

                    this.templateTopicService.updateTopic(updTopic);
                }

                if(result.templateTopicName != updTopic.name){
                    updTopic.name = result.templateTopicName;

                    this.displayDataTemplateTopic = this.updateTopic(updTopic);
                    this.templateTopicService.updateTopic(updTopic);
                }

                if(updTopic.templateReferences){
                    updTopic.templateReferences.forEach(reference =>{
                        if(result.templateReferenceName != reference.name ||
                            result.templateDescription != reference.description
                        )
                        {
                            reference.enabled = updTopic.sectionId != null ? true : false;
                            reference.description = result.templateDescription;
                            reference.name = result.templateReferenceName;
                            this.templateReferenceService.updateTemplateReference(reference);
    
                            this.displayDataTemplateTopic = this.updateReference(reference);
                        }
                        
                    });
                }
                this.updateTemplateTopicService.updateItem(updTopic);
            }
        });
    }

    updateReference(reference: Reference): TopicDataModel[] {
        let updateReference =   this.displayDataTemplateTopic.find(t => t.templateReference.id == reference.id);
        let index =  this.displayDataTemplateTopic.indexOf(updateReference);
        this.displayDataTemplateTopic[index].templateReference.description = reference.description;
        this.displayDataTemplateTopic[index].templateReference.name = reference.name;

        this.updateTemplateTopicService.editReference(reference.templateTopicId, reference);

        return this.displayDataTemplateTopic;
    }

    updateTopic(topic: TemplateTopic): TopicDataModel[] {
        let updateTopic =   this.displayDataTemplateTopic.find(t=> t.templateTopic.id == topic.id);
        let index =  this.displayDataTemplateTopic.indexOf(updateTopic);
        this.displayDataTemplateTopic[index].templateTopic.name = topic.name;
        return this.displayDataTemplateTopic;
    }

    searchTopic(){
    }

    searchReference(){

    }
    searchSection(){

    }
    searchTemplate(){

    }
}

