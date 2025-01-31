import { SectionType } from "./sectionType";
import { SortType } from "./sortType";
import { RotationTopic } from "./rotationTopic";

export class RotationSection {
    public name: string;
    public id?: string;
    public rotationId: string;
    public addBtnShow?: boolean = true;
    public templateSection: boolean = false;
    public sortTopicType: SortType = 0;
    public sortReferenceType: SortType = 0;
    public type: SectionType;
    public topics?: RotationTopic[] = [];
}
  