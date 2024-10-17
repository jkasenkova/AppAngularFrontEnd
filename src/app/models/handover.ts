import { Guid } from "guid-typescript";
import { HandoverSection } from "./handoverSection";

export class Handover {
    public templateId: Guid;
    public handoverId: Guid;
    public ownerId: Guid;
    public recipientId: Guid;
    public sections: HandoverSection[] = [];
    public createDate: string;
    public endDate: string;
    public liveRotation: boolean = false;
}
