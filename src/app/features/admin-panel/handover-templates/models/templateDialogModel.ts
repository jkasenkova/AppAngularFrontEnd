import { Template } from 'src/app/models/template';

export interface TemplateDialogModel {
    templateId?: string;
    templateName?: string;
    templates: Template[];
}
