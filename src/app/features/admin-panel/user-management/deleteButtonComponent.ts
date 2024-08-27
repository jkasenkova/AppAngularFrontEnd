import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DeleteUserDialogComponent } from './user-dialog/delete-user/delete-user-dialog.component';

@Component({
    standalone: true,
    imports: [MatButtonModule],
    styleUrls: ['./user-management.component.less'],
    template: `<button mat-stroked-button class="btn-delete-user" (click)="buttonClicked()">Delete</button>`
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
        debugger;
        const dialogRef = this.dialog.open(DeleteUserDialogComponent, { 
            data: { 
                userName: this.params.data.userName, 
                userSurname:  this.params.data.userSurname, 
                userId:  this.params.data.userId
            },
            panelClass: 'user-management-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}
