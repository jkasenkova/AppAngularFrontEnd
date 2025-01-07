import { Guid } from "guid-typescript";
import { ShiftState } from "./shiftState";

export class Shift {
    public templateId: Guid;
    public ownerId: Guid;
    public shiftRecipientId: Guid;
    public endDateTime: string;
    public state: ShiftState;
    public shiftName: string;
}