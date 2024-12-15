import { Guid } from "guid-typescript";
import { StringValueToken } from "html2canvas/dist/types/css/syntax/tokenizer";
import { Section } from "src/app/models/section";
import { Template } from "src/app/models/template";
import { TemplateTopic } from "src/app/models/templateTopic";

export class TopicDataModel {
    templateTopicId?: Guid;
    templateTopicName: string;
    sectionId?: Guid;
    sectionName: string;
    templateReferenceId?:Guid;
    templateReferenceName: string;
    templateDescription?: string;
    attachToTemplate?: Guid[];
    templates?:Template[];
    sections?:Section[];
    associatedTemplates?: Template[];
    topics?: TemplateTopic[];
    templateList: string;
}
