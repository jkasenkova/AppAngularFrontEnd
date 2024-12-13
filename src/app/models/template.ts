import { Guid } from "guid-typescript";
import { Section } from "./section";

export class Template {
    public name: string;
    public id?: Guid;
    public sections?: Section[] = [];
    public isHandover!: boolean;
}
