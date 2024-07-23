import { Section } from "./section";
import { Reference } from "./reference";

export class TemplateTopic {
  public section?: Section;
  public sectionId?: string;
  public id!: string;
  public name!: string;
  public enabled!: boolean;
  public index!: number;
  public editing: boolean = false;
  public isExpand: boolean = false;
  public parentTopicId?: string;
  public parentTopic?: TemplateTopic;
  public childTopics: TemplateTopic[] = [];
  public references: Reference[] = [];
}
