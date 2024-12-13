import timezonejson from '../../assets/timezone.json'
import { Injectable } from '@angular/core';
import {Timezone } from '../models/timezoneModel';

@Injectable({
    providedIn: 'root'
})
export class TimezoneProvider {
    private timezones: Timezone[];
    
    constructor() {
        this.timezones = timezonejson.map(x => 
        {
            const item: Timezone = {
                abbr: x.abbr,
                name: x.text
            };
            return item;
        });
    }

    getByKey(abbr: string): Timezone | any {
        return this.timezones.filter(x => x.abbr == abbr)[0];
    }

    getByName(name: string): Timezone | any {
        return this.timezones.filter(x => x.name == name)[0];
    }

    getTimezones(): Timezone[] {
        return this.timezones;
    }
}