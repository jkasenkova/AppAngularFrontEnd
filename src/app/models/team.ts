import { Guid } from "guid-typescript";

export class Team {
    teamId?: Guid;
    teamName: string;
    locationId: Guid;
}