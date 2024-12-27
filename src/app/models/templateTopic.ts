import { Section } from "./section";
import { Reference } from "./reference";
import { Guid } from "guid-typescript";

export class TemplateTopic {
    public section?: Section;
    public sectionId?: Guid;
    public id?: Guid;
    public name: string;
    public enabled: boolean;
    public index: number;
    public editing: boolean = false;
    public isExpand: boolean = false;
    public parentTopicId?: Guid;
    public parentTopic?: TemplateTopic;
    public childTopics?: TemplateTopic[] = [];
    public templateReferences: Reference[] = [];
}
