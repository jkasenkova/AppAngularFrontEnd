import { SectionType } from "./sectionType";
import { SortType } from "./sortType";
import { TemplateTopic } from "./templateTopic";
import { Guid } from 'guid-typescript';

export class Section {
  public name: string;
  public id?: Guid;
  public templateId: Guid;
  public iHandoverSection?: boolean = false;
  public type?: SectionType = 2;
  public sortType?: SortType = 0;
  public sortReferenceType?: SortType = 0;
  public sectionTopics?: TemplateTopic[] = [];
}