
import { RotationSection } from "./handoverSection";
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
    public sections?: RotationSection[] = []
    public reportComments?: ReportCommentsModel[] = [];
}
