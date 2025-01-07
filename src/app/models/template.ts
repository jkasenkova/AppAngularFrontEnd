import { Section } from "./section";

export class Template {
    public name: string;
    public id?: string;
    public sections?: Section[] = [];
    public isHandover!: boolean;
}
