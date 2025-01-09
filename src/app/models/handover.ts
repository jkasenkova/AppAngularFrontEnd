import { HandoverSection } from "./handoverSection";
import { MyTeamModel } from "./myTeamModel";
import { ReportCommentsModel } from "./reportCommentsModel";
import { ShiftState } from "./shiftState";
import { UserModel } from "./user";

export class Handover {
    public templateId: string;
    public id?: string;
    public ownerId: string;
    public shiftRecipientId: string;
    public startDateTime?: string;
    public endDateTime: string;
    public state: ShiftState;
    public shareUsers?: UserModel[] = [];
    public shareEmails?: string[] = [];
    public sections?: HandoverSection[] = []
    public reportComments?: ReportCommentsModel[] = [];
}
