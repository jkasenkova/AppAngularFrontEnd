import { Guid } from "guid-typescript";
import { TemplateTopic } from "./templateTopic";

export class Reference {
    public id!: Guid;
    public templateTopicId!: Guid;
    public templateTopic?: TemplateTopic;
    public name!: string;
    public description?: string;
    public enabled: boolean = false;
    public index: number = 0;
    public editing: boolean = false;
    public parentReferenceId?: string;
    public childReferences?: Reference[];
    public templateId?: string;
}
