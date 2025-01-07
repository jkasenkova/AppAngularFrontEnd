import { TemplateTopic } from "./templateTopic";

export class AddTopic {
    public topicName!: string;
    public referenceName!: string;
    public description?: string;
    public topicId?: string;
    public topic?: TemplateTopic;
    public referenceId?: string;
    public templateId?: string;
    public sectionId?: string;
}
