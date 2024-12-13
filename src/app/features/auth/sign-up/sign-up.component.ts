import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from '@angular/router';
import moment from 'moment-timezone';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Timezone } from "../../../models/timezoneModel";
import { AuthService } from "../../../services/auth/auth.service";
import { LocationService } from "../../../services/locationService";
import { AccountService } from '../../../services/accountService';
import { Location } from "src/app/models/location";
import { TimezoneProvider } from '../../../shared/timezone.provider';
import { SignUpResponse } from '../../../models/signUpResponse';
import { SignUpData } from '../../../models/signUpData';
import { AccountModel } from '../../../models/accountModel';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

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
    public timeZones: Timezone[] = [];
    showPassword: boolean;
    public isAgree: boolean = false;
    public filteredTimezones: Observable<string[]>;

    constructor(
        private accountService: AccountService,
        private router: Router,
        private authService: AuthService,
        private locationService: LocationService,
        private fb: FormBuilder,
        private tz: TimezoneProvider) {
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
        this.timeZones = this.tz.getTimezones();

        /*this.filteredTimezones = this.signUpForm.value.timeZoneControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );*/
    }

    submit() {
        const timezone = this.tz.getByName(this.signUpForm.value.timeZoneControl);

        const signUpData: SignUpData = {
            email: this.signUpForm.value.email,
            firstName: this.signUpForm.value.firstName,
            lastName: this.signUpForm.value.lastName,
            companyName: this.signUpForm.value.company,
            timezone: timezone.abbr,
            password: this.signUpForm.value.password,
            passwordConfirm: this.signUpForm.value.confirmPassword
        };
        this.authService.signUp(signUpData).subscribe((response: SignUpResponse) => {
            if (response.succeeded) {
                const accountModel: AccountModel = {
                    id: response.companyId,
                    name: response.companyName,
                    timezone: timezone.abbr
                };
                this.accountService.createAccount(accountModel).subscribe(x => console.log(x));

                const location: Location = {
                    name: this.signUpForm.value.officeLocation,
                    timeZone: timezone.abbr,
                    isAccountLocation: true
                };

                this.locationService.createLocation(location);

                this.signUpForm.reset();
                this.router.navigate(['/sign-in']);
            }
        });
    }

    private _filter(value: string): Timezone[] {
        const filterValue = this._normalizeValue(value);
        return this.timeZones.filter(item => this._normalizeValue(item.name).includes(filterValue));
    }

    private _normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }
}