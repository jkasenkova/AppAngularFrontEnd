import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { TemplateService } from "src/app/services/templateService";
import { Template } from "src/app/models/template";
import { CommonModule } from "@angular/common";


@Component({
    selector: 'create-template-dialog',
    templateUrl: './create-template-dialog.component.html',
    styleUrl: './create-template-dialog.component.less',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule,
        MatIconModule,
        MatDialogModule,
        MatGridListModule,
        CommonModule
    ],
})
export class CreateTemplateDialogComponent implements OnInit{
    templateForm: FormGroup;
    templates: Template[];
    
    constructor(
        private fb: FormBuilder,
        private templateService: TemplateService,
        public dialogRef: MatDialogRef<CreateTemplateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Template
    ) {
        this.templateForm = this.fb.group({
            templateName: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.templateService.getTemplates().subscribe(templates =>{
            this.templates = templates.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {

        var templateName = this.templateForm.get('templateName').value;

        if(this.templates.find(l=>l.name.toLocaleLowerCase() == templateName.toLocaleLowerCase()) != null){
            this.templateForm.get('templateName').setErrors({'existTemplateName': true})
        }

        if (this.templateForm.valid) {
            this.dialogRef.close(this.templateForm.value);
        }
    }
}