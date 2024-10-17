import { Guid } from "guid-typescript";
import { Handover } from "./handover";
import { SectionType } from "./sectionType";
import { SortType } from "./sortType";
import { RotationTopic } from "./rotationTopic";
import { Reference } from "./reference";

export class HandoverSection {
    public sectionName!: string;
    public sectionId?: Guid;
    public handoverId!: Guid;
    public handover?: Handover;
    public iHandoverSection?: boolean = false;
    public sectionType?: SectionType;
    public addBtnShow?: boolean = true;
    public sortType?: SortType = 0;
    public sortReferenceType?: SortType = 0;
    public sectionTopics?: RotationTopic[] = [];
    public sectionReferences?: Reference[];
    public suggestTopics?: RotationTopic[];
  }
  