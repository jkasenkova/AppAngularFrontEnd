import { Template } from "./template";
import { SectionType } from "./sectionType";
import { SortType } from "./sortType";
import { TemplateTopic } from "./templateTopic";
import { Observable } from "rxjs";
import { Reference } from "./reference";
import { Guid } from 'guid-typescript';

export class Section {
  public sectionName!: string;
  public sectionId?: Guid;
  public templateId!: Guid;
  public template?: Template;
  public iHandoverSection?: boolean = false;
  public sectionType?: SectionType;
  public addBtnShow?: boolean = true;
  public sortType?: SortType = 0;
  public sortReferenceType?: SortType = 0;
  public sectionTopics?: TemplateTopic[] = [];
  public sectionReferences?: Reference[];
  public suggestTopics?: TemplateTopic[];
}
