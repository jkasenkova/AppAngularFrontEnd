import { Guid } from "guid-typescript";
import { Template } from "src/app/models/template";

export interface TemplateTopicDialogModel {
    templateTopicId?: Guid;
    templateTopicName: string;
    sectionId?: Guid;
    templateReferenceId?:Guid;
    templateReferenceName: string;
    templateDescription?: string;
    attachToTemplate?: Guid[];
    templates?:Template[];
}
