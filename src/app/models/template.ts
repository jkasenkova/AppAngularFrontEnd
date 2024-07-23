import { Section } from "./section";

export class Template {
    public templateName!: string;
    public templateId!: string;
    public sections: Section[] = [];
    public isHandoverTemplate!: boolean;
}
