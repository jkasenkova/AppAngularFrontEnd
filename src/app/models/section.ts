import { SectionType } from "./sectionType";
import { SortType } from "./sortType";
import { TemplateTopic } from "./templateTopic";

export class Section {
  public name: string;
  public id?: string;
  public templateId: string;
  public iHandoverSection?: boolean = false;
  public type?: SectionType;
  public sortTopicType?: SortType;
  public sortReferenceType?: SortType;
  public sectionTopics?: TemplateTopic[] = [];
}