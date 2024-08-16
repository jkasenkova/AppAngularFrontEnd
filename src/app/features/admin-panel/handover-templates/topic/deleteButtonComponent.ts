import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EditTemplateTopicDialogComponent } from './template-topic-dialog/edit-template-topic/edit-template-topic-dialog.component';

@Component({
    standalone: true,
    imports: [MatButtonModule],
    styleUrls: ['./template-topic.component.less'],
    template: `<button mat-stroked-button class="btn-delete-topic" (click)="buttonClicked()">Delete</button>`,
})
export class DeleteButtonComponent implements ICellRendererAngularComp {
    params: ICellRendererParams;
    readonly dialog = inject(MatDialog);

    agInit(params: ICellRendererParams): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams) {
        return true;
    }

    buttonClicked() {
        const dialogRef = this.dialog.open(EditTemplateTopicDialogComponent, { 
            data: { 
                templateTopicName: this.params.data.topic, 
                templateReferenceName:  this.params.data.reference, 
                templateDescription: '',
                templates:  this.params.data.templates
            },
            panelClass: 'template-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}
