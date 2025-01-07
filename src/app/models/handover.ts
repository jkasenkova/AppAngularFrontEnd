import { HandoverSection } from "./handoverSection";
import { MyTeamModel } from "./myTeamModel";
import { ReportCommentsModel } from "./reportCommentsModel";

export class Handover {
    public templateId: string;
    public handoverId: string;
    public ownerId: string;
    public recipientId?: string;
    public sections: HandoverSection[] = [];
    public createDate: string;
    public endTime: string;
    public endDate: string;
    public liveRotation: boolean = false;
    public shareUsers?: MyTeamModel[]=[];
    public shareEmails?: string[]=[];
    public reportComments?: ReportCommentsModel[] = [];
}
