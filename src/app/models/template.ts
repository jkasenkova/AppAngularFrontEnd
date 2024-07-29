import { Guid } from "guid-typescript";
import { Section } from "./section";

export class Template {
    public templateName: string;
    public templateId: Guid;
    public sections: Section[] = [];
    public isHandoverTemplate!: boolean;
}
