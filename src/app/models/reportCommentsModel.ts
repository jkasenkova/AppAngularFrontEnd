import { Guid } from "guid-typescript";

export class ReportCommentsModel {
    public ownerId: Guid;
    public comment: string;
    public handoverId: Guid;
    public createDate: string;
    public commentId?: Guid;
}