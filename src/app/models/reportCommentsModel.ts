import { Guid } from "guid-typescript";
import { MyTeamModel } from "./myTeamModel";
import { DateStringCellEditor } from "ag-grid-enterprise";

export class ReportCommentsModel {
    public owner: MyTeamModel;
    public comment: string;
    public handoverId: Guid;
    public createDate: string;
}