import { Guid } from "guid-typescript";

export interface TeamModel {
    teamId?: Guid;
    teamName: string;
    locationId: Guid;
}