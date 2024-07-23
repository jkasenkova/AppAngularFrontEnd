export interface TemplateDialogModel {
    templateId?: number;
    templateName?: string;
    action: 'create' | 'edit' | 'delete';
}
