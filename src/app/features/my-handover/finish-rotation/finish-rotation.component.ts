import { Component } from "@angular/core";
import {  MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'finish-rotation',
    standalone: true,
    templateUrl: './finish-rotation.component.html',
    styleUrls: ['./finish-rotation.component.less']
  })

export class FinishRotationDialogComponent {

    constructor(public dialogRef: MatDialogRef<FinishRotationDialogComponent>) {}

    onNoClick(): void {
        this.dialogRef.close(false);
      }
    
      onYesClick(): void {
        this.dialogRef.close(true);
      }
}