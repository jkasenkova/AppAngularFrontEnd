import { Guid } from "guid-typescript";
import { TemplateTopic } from "./templateTopic";

export class AddTopic {
    public topicName!: string;
    public referenceName!: string;
    public description?: string;
    public topicId?: Guid;
    public topic?: TemplateTopic;
    public referenceId?: string;
    public templateId?: Guid;
    public sectionId?: string;
}
