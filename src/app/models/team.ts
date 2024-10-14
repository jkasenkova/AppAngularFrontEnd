import { Guid } from "guid-typescript";

export class Team {
    id?: Guid;
    name: string;
    locationId: Guid;
}