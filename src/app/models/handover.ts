import { Guid } from "guid-typescript";
import { HandoverSection } from "./handoverSection";
import { MyTeamModel } from "./myTeamModel";
import { ReportCommentsModel } from "./reportCommentsModel";

export class Handover {
    public templateId: Guid;
    public handoverId: Guid;
    public ownerId: Guid;
    public recipientId: Guid;
    public sections: HandoverSection[] = [];
    public createDate: string;
    public endDate: string;
    public liveRotation: boolean = false;
    public shareUsers?: MyTeamModel[]=[];
    public shareEmails?: string[]=[];
    public reportComments?: ReportCommentsModel[] = [];
}
