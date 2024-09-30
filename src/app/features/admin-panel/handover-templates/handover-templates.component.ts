import { Component, OnInit, Output, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectionStrategy } from "@angular/core";
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'handover-templates.component.html',
    styleUrls: ['handover-templates.component.less'],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class HandoverTemplatesComponent implements OnInit {
    templates: Template[];
    template: Template;
    selectedIndex = 1;
    isSelectedTemplate: boolean = false;
    isHandoverTemplate: boolean = false;
    @Output() selectedTemplate: Template;
    readonly dialog = inject(MatDialog);

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

    constructor(
        private templateService: TemplateService,
        private sessionStorageService: SessionStorageService) { }

    ngOnInit(): void {

        this.templates = this.templateListTemp;

        var templateId = this.sessionStorageService.getItem<Guid>('templateId');
        this.selectedIndex = this.sessionStorageService.getItem<number>('template-tab');

        this.getTemplates();

        if (templateId) {
            this.isSelectedTemplate = true;
            this.getTemplateById(templateId);
        }
    }


    getTemplateById(id: Guid): void {
        this.templateService.getTemplates().pipe(
            map(templates => templates.find(template => template.templateId === id))
        ).subscribe(template => this.template = template);
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
        const dialogRef = this.dialog.open(CreateTemplateDialogComponent, { 
                data: { templateName: '' },
                panelClass: 'template-dialog'
            }
        );

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                
            }
        });
    }

    editTemplateDialog(template: Template): void {
        const dialogRef = this.dialog.open(EditTemplateDialogComponent, {
            data: { templateId: template.templateId, templateName: template.templateName },
            panelClass: 'template-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    deleteTemplateDialog(template: Template): void {
        const dialogRef = this.dialog.open(DeleteTemplateDialogComponent, {
            data: { templateId: template.templateId, templateName: template.templateName },
            panelClass: 'template-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    copyTemplateDialog(template: Template){
        const dialogRef = this.dialog.open(CopyTemplateDialogComponent, {
            data: 
            { 
                templateId: template.templateId, 
                templateName: template.templateName,
                templates: this.templateListTemp
            },
            panelClass: 'template-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }
}

