import { Component, OnInit, Output, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from "@angular/core";
import { Template } from "../../../models/template";
import { TemplateService } from "../../../services/templateService";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TemplateComponent } from "./template/template.component";
import { TemplateTopicComponent } from "./topic/template-topic.component";
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from "../../../services/modalService";
import { MatDialog } from '@angular/material/dialog';
import { TemplateDialogComponent } from "./template-dialog/template-dialog.component";
import { SessionStorageService } from "../../../services/sessionStorageService";
import { Observable, map } from "rxjs";

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
    selectedIndex = 1;
    isSelectedTemplate: boolean = false;
    isHandoverTemplate: boolean = false;
    @Output() selectedTemplate: Template;
    readonly dialog = inject(MatDialog);
    constructor(
        private templateService: TemplateService,
        private modalService: ModalService,
        private sessionStorageService: SessionStorageService) { }

    ngOnInit(): void {
        var templateId = this.sessionStorageService.getItem<string>('templateId');
        this.selectedIndex = this.sessionStorageService.getItem<number>('template-tab');

        this.getTemplates();

        if (templateId) {
            this.isSelectedTemplate = true;
            this.getTemplateById(templateId);
        }
    }


    getTemplateById(id: string): void {
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

    openDialog(action: 'create' | 'edit' | 'delete', template?: Template): void {
        const dialogRef = this.dialog.open(TemplateDialogComponent, {
            data: { template, action }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (action === 'create') {
                   
                } else if (action === 'edit') {
                   
                } else if (action === 'delete') {
                   
                }
            }
        });
    }
}

