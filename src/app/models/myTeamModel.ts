import { Guid } from "guid-typescript";
import { ShareRecipient } from "./shareRecipientModel";

export class MyTeamModel {
    public ownerName: string;
    public ownerEmail: string;
    public ownerRoleId: Guid;
    public userId: Guid;
    public recipientId: Guid;
    public locationId: Guid;
    public lineManagerId: Guid;
    public curentRotationId?: Guid;
    public contributors?: Guid[];
    public alwaysShareRecipient?: ShareRecipient;
}