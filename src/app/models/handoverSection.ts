import { Handover } from "./handover";
import { SectionType } from "./sectionType";
import { SortType } from "./sortType";
import { RotationTopic } from "./rotationTopic";

export class HandoverSection {
    public sectionName: string;
    public sectionId?: string;
    public handoverId: string;
    public handover?: Handover;
    public iHandoverSection: boolean = false;
    public sectionType: SectionType;
    public addBtnShow?: boolean = true;
    public templateSection:boolean = false;
    public sortType: SortType = 0;
    public sortReferenceType: SortType = 0;
    public sectionTopics?: RotationTopic[] = [];
    public appendAddItemLine: boolean = false;
}
  