import { Guid } from "guid-typescript";
import { ReportCommentsModel } from "./reportCommentsModel";
import { HandoverSection } from "./handoverSection";
import { ShiftState } from "./shiftState";
import { UserModel } from "./user";

export class Handover {
    public templateId: Guid;
    public handoverId?: Guid;
    public ownerId: Guid;
    public shiftRecipientId: Guid;
    public startDateTime?: string;
    public endDateTime: string;
    public state: ShiftState;
    public shareUsers?: UserModel[] = [];
    public shareEmails?: string[] = [];
    public sections?: HandoverSection[] = []
    public reportComments?: ReportCommentsModel[] = [];
}
