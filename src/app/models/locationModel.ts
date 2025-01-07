import { Timezone } from "./timezoneModel";

export class LocationModel {
    id?: string;
    name: string = '';
    address?: string;
    mapLink?: string;
    timeZone: string = '';
    isAccountLocation: boolean;
    timeZones?: Timezone[];
}