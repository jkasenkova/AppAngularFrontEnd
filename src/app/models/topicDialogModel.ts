import { TemplateTopic } from "./templateTopic";
import { TopicData } from "./topicData";

export interface TopicDialogModel {
  header: string;
  topic: string;
  reference: string;
  notes?: string;
  edit: boolean;
  template?: string;
  templateTopic?: TemplateTopic;
  referenceId: string;
  topicData: TopicData[];
  sectionId: string;
  templateId: string;
}
