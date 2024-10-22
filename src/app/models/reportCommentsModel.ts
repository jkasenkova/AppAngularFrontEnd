import { Guid } from "guid-typescript";
import { MyTeamModel } from "./myTeamModel";

export class ReportCommentsModel {
    public owner: MyTeamModel;
    public comment: string;
    public handoverId: Guid;
    public createDate: string;
    public commentId?: Guid;
}