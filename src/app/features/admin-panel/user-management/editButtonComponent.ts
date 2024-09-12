import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EditUserDialogComponent } from './user-dialog/edit-user/edit-user-dialog.component';

@Component({
    standalone: true,
    imports: [MatButtonModule],
    styleUrls: ['./user-management.component.less'],
    template: `<button mat-stroked-button class="btn-edit-user" (click)="buttonClicked()">Edit</button>`
})

export class EditButtonComponent implements ICellRendererAngularComp {
    params: ICellRendererParams;
    readonly dialog = inject(MatDialog);

    agInit(params: ICellRendererParams): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams) {
        return true;
    }

    buttonClicked() {
        const dialogRef = this.dialog.open(EditUserDialogComponent, { 
            data: this.params.data,
            panelClass: 'user-management-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}
