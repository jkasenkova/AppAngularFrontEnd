import { Section } from "@models/section";
import { Template } from "@models/template";
import { TemplateTopic } from "@models/templateTopic";

export class TopicDataModel {
    templateTopicId?: string;
    templateTopicName: string;
    sectionId?: string;
    templateReferenceId?: string;
    templateReferenceName: string;
    templateDescription?: string;
    attachToTemplate?: string[];
    templates?:Template[];
    sections?:Section[];
    associatedTemplates?: Template[];
    topics?: TemplateTopic[];
    templateList: string;
    topic: TemplateTopic;
}
