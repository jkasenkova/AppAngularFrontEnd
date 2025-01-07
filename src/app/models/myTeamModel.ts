import { ShareRecipient } from "./shareRecipientModel";

export class MyTeamModel {
    public ownerName?: string;
    public ownerEmail?: string;
    public ownerRole?: string;
    public ownerRoleId?: string;
    public userId?: string;
    public isActiveRotation?: boolean;
    public recipientId?: string;
    public locationId?: string;
    public lineManagerId?: string;
    public currentRotationId?: string;
    public contributors?: string[];
    public selected?: boolean = false;
    public alwaysShareRecipient?: ShareRecipient;
}