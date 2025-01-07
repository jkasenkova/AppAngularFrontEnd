import { Guid } from "guid-typescript";
import { Reference } from "src/app/models/reference";
import { Section } from "src/app/models/section";
import { Template } from "src/app/models/template";
import { TemplateTopic } from "src/app/models/templateTopic";

export class TopicDataModel {
    templateTopic:TemplateTopic;
    templateReference: Reference;
    attachToTemplate?: Guid[];
    templates?:Template[];
    sections?:Section[];
    associatedTemplates?: Template[];
    templateTopics?: TemplateTopic[];
    templateList: string;
}
