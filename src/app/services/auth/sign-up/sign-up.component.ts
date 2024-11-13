import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from '@angular/router';
import moment from 'moment-timezone';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Timezone } from "../../../models/timezoneModel";
import { SignUpResponse, SignUpData } from "../auth.service";
import { AuthService } from "../auth.service";
import { UserService } from "../../userService";

@Component({
    selector: 'sign-up',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatCheckboxModule
    ],
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class SignUpComponent implements OnInit{
    signUpForm: FormGroup;
    timeZones: Timezone[] = [];
    showPassword: boolean;
    isAgree: boolean = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private fb: FormBuilder) {
        this.signUpForm = this.fb.group({
            email: ['',   Validators.compose([Validators.email, Validators.required])],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            company: ['', Validators.required],
            position: ['', Validators.required],
            officeLocation: ['', Validators.required],
            timeZoneControl: ['', Validators.required],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(100)
            ])],
            confirmPassword: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(100)
            ])]
        });
    }

    ngOnInit(): void {
        this.timeZones = moment.tz.names().map((zoneName) => {
            return {
                zoneName: zoneName,
                utc: moment.tz(zoneName).format('Z'),
                zoneAbbr: moment.tz(zoneName).zoneAbbr()
            }
        });
    }

    submit() {
        const signUpData: SignUpData = {
            email: this.signUpForm.value.email,
            firstName: this.signUpForm.value.firstName,
            lastName: this.signUpForm.value.lastName,
            companyName: this.signUpForm.value.company,
            position: this.signUpForm.value.position,
            officeLocation: this.signUpForm.value.officeLocation,
            timeZoneControl: this.signUpForm.value.timeZoneControl,
            password: this.signUpForm.value.password,
            passwordConfirm: this.signUpForm.value.confirmPassword
        }
        this.authService.signUp(signUpData).subscribe((response: SignUpResponse) => {
            if (response.succeeded) {
                this.router.navigate(['/sign-in']);
            }
        });
        this.signUpForm.reset();
    }
}