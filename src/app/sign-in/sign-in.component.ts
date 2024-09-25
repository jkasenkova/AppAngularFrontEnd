import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'sign-in',
    standalone: true,
    imports: [
        RouterOutlet,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class SignInComponent {
    signInForm: FormGroup;
    
    constructor(
        private router: Router,
        private fb: FormBuilder) {
            this.signInForm = this.fb.group({
                userName: '',
                password:''
            });
        }

        registration(){
            this.router.navigate(['/sign-up']);
        }
}