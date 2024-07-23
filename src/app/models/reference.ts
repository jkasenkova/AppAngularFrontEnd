import { TemplateTopic } from "./templateTopic";

export class Reference {
  public id?: string;
  public templateTopicId!: string;
  public templateTopic!: TemplateTopic;
  public name!: string;
  public description?: string;
  public enabled: boolean = false;
  public index: number = 0;
  public editing: boolean = false;
  public parentReferenceId?: string;
  public childReferences?: Reference[];
  public templateId?: string;
}
