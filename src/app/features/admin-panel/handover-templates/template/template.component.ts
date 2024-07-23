import { Component, Input, OnInit, inject } from '@angular/core';
import { Template } from '../../../../models/template';
import { Section } from '../../../../models/section';
import { SectionService } from '../../../../services/sectionService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SectionDialogComponent } from '../section-dialog/section-dialog.component';


@Component({
    selector: 'app-template',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './template.component.html',
    styleUrls: ['template.component.less']
})

export class TemplateComponent implements OnInit {
    isSelectedTemplate: boolean = false;
    @Input() selectedTemplate?: Template;
    sections?: Section[];
    readonly dialog = inject(MatDialog);

    constructor(private sectionService: SectionService) { }

    ngOnInit(): void {
        if (this.selectedTemplate) {
            this.isSelectedTemplate = true;
            this.getTemplateSections(this.selectedTemplate);
        }
    }

    getTemplateSections(template: Template): void{
        this.sectionService.getSections(template.templateId).subscribe(sections => {
            template.sections = sections;
            this.sections = sections;
        })
    }

    //---------Section Dialogs------------

    openDialog(action: 'create' | 'edit' | 'delete', section?: Section): void {
        const dialogRef = this.dialog.open(SectionDialogComponent, {
            data: { section, action }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (action === 'create') {

                } else if (action === 'edit') {

                } else if (action === 'delete') {
                    //templateId  = this.selectedTemplate
                }
            }
        });
    }

    openCreateSectionDialog(action: 'create', template?: Template): void {
        const dialogRef = this.dialog.open(SectionDialogComponent, {
            data: { template, action }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                
            }
        });
    }
}

