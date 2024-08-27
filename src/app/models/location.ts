import { Guid } from "guid-typescript";

export interface Location {
    id?: Guid;
    name: string;
    address?: string;
    mapLink?: string;
    timeZoneId: Guid;
}