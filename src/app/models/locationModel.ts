import { Guid } from "guid-typescript";
import { Timezone } from "./timezoneModel";

export class LocationModel {
    id?: Guid;
    name: string = '';
    address?: string;
    mapLink?: string;
    timeZone: string = '';
    timeZones?: Timezone[];
}