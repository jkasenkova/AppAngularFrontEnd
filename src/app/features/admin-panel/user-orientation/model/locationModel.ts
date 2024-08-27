import { Guid } from "guid-typescript";

export interface LocationModel {
    id?: Guid;
    name: string;
    address?: string;
    mapLink?: string;
    timeZoneId: Guid;
    timeZones?:string[];
}