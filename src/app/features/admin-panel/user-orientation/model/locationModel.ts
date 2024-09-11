import { Guid } from "guid-typescript";
import { Timezone } from "./timezoneModel";

export interface LocationModel {
    id?: Guid;
    name: string;
    address?: string;
    mapLink?: string;
    timeZoneId: string;
    timeZones?: Timezone[];
}