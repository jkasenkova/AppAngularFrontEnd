import { Component, Input, OnInit, inject } from '@angular/core';
import { Template } from '../../../../models/template';
import { Section } from '../../../../models/section';
import { SectionService } from '../../../../services/sectionService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { CreateSectionDialogComponent } from '../section-dialog/create-section/create-section-dialog.component';
import { EditSectionDialogComponent } from '../section-dialog/edit-section/edit-section-dialog.component';
import { DeleteSectionDialogComponent } from '../section-dialog/delete-section/delete-section-dialog.component';


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

    createSectionDialog(templateId: Guid): void {
        const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
            data: { templateId }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              
            }
        });
    }

    editSectionDialog(sectionId: Guid): void {
        const dialogRef = this.dialog.open(EditSectionDialogComponent, {
            data: { sectionId }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    deleteSectionDialog(sectionId: Guid): void {
        const dialogRef = this.dialog.open(DeleteSectionDialogComponent, {
            data: { sectionId }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }
}

