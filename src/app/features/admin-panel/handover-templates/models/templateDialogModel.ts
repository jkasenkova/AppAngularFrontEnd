import { Guid } from 'guid-typescript';
import { Template } from 'src/app/models/template';
export interface TemplateDialogModel {
    templateId?: Guid;
    templateName?: string;
    templates: Template[];
}
