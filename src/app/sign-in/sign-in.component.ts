import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
    selector: 'sign-in',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule 
    ],
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class SignInComponent {
    signInForm: FormGroup;
    
    constructor(
        private fb: FormBuilder) {
            this.signInForm = this.fb.group({
                userName: '',
                password:''
            });
        }
}