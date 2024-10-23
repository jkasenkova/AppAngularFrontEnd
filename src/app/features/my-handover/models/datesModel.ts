import { Guid } from 'guid-typescript';
import { Handover } from 'src/app/models/handover';

export interface DatesModel {
    ownerId: Guid;
    handover?: Handover;
    endDate?: string;
    time?: string;
}
