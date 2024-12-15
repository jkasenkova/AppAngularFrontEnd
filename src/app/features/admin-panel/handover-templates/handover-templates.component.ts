import { Component, OnInit, Output, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, inject } from "@angular/core";
import { Template } from "../../../models/template";
import { TemplateService } from "../../../services/templateService";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TemplateComponent } from "./template/template.component";
import { TemplateTopicComponent } from "./topic/template-topic.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SessionStorageService } from "../../../services/sessionStorageService";
import { map } from "rxjs";
import { CreateTemplateDialogComponent } from "./dialogs/template/create-template/create-template-dialog.component";
import { Guid } from 'guid-typescript';
import { EditTemplateDialogComponent } from "./dialogs/template/edit-template/edit-template-dialog.component";
import { DeleteTemplateDialogComponent } from "./dialogs/template/delete-template/delete-template-dialog.component";
import { CopyTemplateDialogComponent } from "./dialogs/template/copy-template/copy-template.component";
import { UpdateTemplateService } from "src/app/services/updateTemplateService";

@Component({
    selector: 'app-handover-templates',
    standalone: true,
    imports: [
        MatButtonModule,
        TemplateComponent,
        TemplateTopicComponent,
        MatSelectModule,
        MatTabsModule,
        MatFormFieldModule
    ],
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'handover-templates.component.html',
    styleUrls: ['handover-templates.component.less'],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class HandoverTemplatesComponent implements OnInit {
    templates: Template[];
    template: Template;
    selectedIndex = 0;
    isSelectedTemplate: boolean = false;
    isHandoverTemplate: boolean = false;
    @Output() selectedTemplate: Template;
    readonly dialog = inject(MatDialog);

    constructor(
        private templateService: TemplateService,
        private updateTemplateService: UpdateTemplateService,
        private sessionStorageService: SessionStorageService) 
        {
        }
  
    ngOnInit(): void {
        this.templateService.getTemplates().subscribe(templates =>
            this.templates = templates
        );
        this.updateTemplateService.data$.subscribe((data) => {
            this.templates = this.templates.concat(data);
        });
    }

    updateTemplateArray(): void {
        this.templates = [...this.templates];
      }

    getTemplateById(id: Guid): void {
        this.templateService.getTemplates().pipe(
            map(templates => templates.find(template => template.id === id))
        ).subscribe(template => {
            this.template = template;
            this.isSelectedTemplate = true;
        });
    }


    getTemplates(): void {
        this.templateService.getTemplates()
        .subscribe(value => this.templates = value);
    }

    onSelectTemplate(event: MatSelectChange): void {
        if (event.value != undefined) {
            this.sessionStorageService.setItem('templateId', event.value.templateId);
            this.isSelectedTemplate = true;
            this.template = event.value;
            this.selectedTemplate = event.value;
            this.isHandoverTemplate =  this.template.isHandover;
        }
        else {
            this.isSelectedTemplate = false;
            sessionStorage.clear();
        }
    }

    onTabChanged(event: MatTabChangeEvent): void {
        this.sessionStorageService.setItem('template-tab', event.index.toString());
    }

    //--------------Template Dialogs---------------------

    createTemplateDialog(): void {
        const dialogRef = this.dialog.open(CreateTemplateDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                var templateModel: Template = {
                    name: result.templateName,
                    isHandover: false,
                    sections: []
                };
                
                this.templateService.addTemplate(templateModel).subscribe(newTemplate => 
                {
                    this.selectedTemplate = newTemplate;
                    this.isSelectedTemplate = true;
                    this.template = newTemplate;
                    this.templates.push(newTemplate);
                    this.templates = this.templates.sort((a, b) => a.name.localeCompare(b.name));
                });
            }
        });
    }


    editTemplateDialog(template: Template): void {
        const dialogRef = this.dialog.open(EditTemplateDialogComponent, {
            data: template,
            panelClass: 'template-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.templateService.updateTemplate(result);
                this.template = result;
                this.selectedTemplate = result;
                let updateTemplate = this.templates.find(l=> l.id == result.id);
                let index = this.templates.indexOf(updateTemplate);
                this.templates[index].name = result.name;
            }
        });
    }

    deleteTemplateDialog(template: Template): void {
        const dialogRef = this.dialog.open(DeleteTemplateDialogComponent, 
        {
            data: 
            { 
                id: template.id, 
                name: template.name 
            },
            panelClass: 'template-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.templateService.deleteTemplateById(template.id);
                this.templates = this.templates.filter(t=>t.id != template.id);
                this.isSelectedTemplate = false;
                this.template = null;
                this.selectedTemplate = null;
            }
        });
    }

    copyTemplateDialog(template: Template){
        const dialogRef = this.dialog.open(CopyTemplateDialogComponent, {
            data: 
            { 
                templateId: template.id, 
                templateName: template.name,
                templates: this.templates
            },
            panelClass: 'template-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }
}

