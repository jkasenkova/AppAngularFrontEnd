import { Observable } from "rxjs";
import { TemplateTopic } from "./templateTopic";
import { Reference } from "./reference";

export interface TopicData {
  sectionId?: string;
  topicId: string;
  topic?: TemplateTopic;
  topicName: string;
  referenceName: string;
  reference: Reference;
  referenceId?: string;
  template: Observable<string>;
  section?: string;
  description?: string;
}
