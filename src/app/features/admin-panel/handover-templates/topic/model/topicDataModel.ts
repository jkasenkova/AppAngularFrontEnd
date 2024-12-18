import { Guid } from "guid-typescript";
import { Observable } from "rxjs";
import { Section } from "src/app/models/section";
import { Template } from "src/app/models/template";
import { TemplateTopic } from "src/app/models/templateTopic";

export class TopicDataModel {
    templateTopicId?: Guid;
    templateTopicName: string;
    sectionId?: Guid;
    templateReferenceId?:Guid;
    templateReferenceName: string;
    templateDescription?: string;
    attachToTemplate?: Guid[];
    templates?:Template[];
    sections?:Section[];
    associatedTemplates?: Template[];
    topics?: TemplateTopic[];
    templateList: string;
    topic: TemplateTopic;
}
