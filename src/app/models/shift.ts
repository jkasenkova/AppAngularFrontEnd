import { ShiftState } from "./shiftState";

export class Shift {
    public templateId: string;
    public ownerId: string;
    public shiftRecipientId: string;
    public endDateTime: string;
    public state: ShiftState;
    public shiftName: string;
}