import { Guid } from "guid-typescript";

export class MyTeamModel {
    public ownerName: string;
    public ownerEmail: string;
    public ownerRole: string;
    public userId: Guid;
    public isActiveRotation: boolean;
    public recipientId: Guid;
    public locationid: Guid;
    public lineManagerId: Guid;
    public curentRotationId?: Guid;
    public contributors?: Guid[];
}