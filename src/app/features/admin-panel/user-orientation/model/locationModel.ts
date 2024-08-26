import { Guid } from "guid-typescript";

export interface LocationModel {
    name: string;
    address: string;
    mapLink: string;
    timeZoneId: Guid;
}