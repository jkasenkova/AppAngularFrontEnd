import { Guid } from "guid-typescript";
import { ShareRecipient } from "./shareRecipientModel";

export class MyTeamModel {
    public ownerName: string;
    public ownerEmail: string;
    public ownerRole: string;
    public userId: Guid;
    public isActiveRotation: boolean;
    public recipientId: Guid;
    public locationId: Guid;
    public lineManagerId: Guid;
    public curentRotationId?: Guid;
    public contributors?: Guid[];
    public selected: boolean = false;
    public shareRecipient?: ShareRecipient;
}