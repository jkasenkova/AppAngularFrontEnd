import { Guid } from "guid-typescript";

export class MyTeamModel {
    public ownerName: string;
    public ownerEmail: string;
    public ownerPosition: string;
    public userId: Guid;
    public isActiveRotation: boolean;
}