import { Section } from "./section";
import { Guid } from "guid-typescript";
import { RotationReference } from "./rotationReference";

export class RotationTopic {
    public section?: Section;
    public sectionId?: Guid;
    public isPinned: boolean = false;
    public id?: Guid;
    public name: string;
    public enabled: boolean;
    public index: number;
    public isExpand: boolean = false;
    public templateTopic: boolean = false;
    public parentTopicId?: Guid;
    public parentTopic?: RotationTopic;
    public childTopics?: RotationTopic[] = [];
    public references?: RotationReference[] = [];
    public checked: boolean = false;
    public editing: boolean = false;
}
