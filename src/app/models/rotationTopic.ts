import { Section } from "./section";
import { RotationReference } from "./rotationReference";

export class RotationTopic {
    public section?: Section;
    public sectionId?: string;
    public isPinned: boolean = false;
    public id?: string;
    public name: string;
    public enabled: boolean;
    public index: number;
    public isExpand: boolean = false;
    public templateTopic: boolean = false;
    public parentTopicId?: string;
    public parentTopic?: RotationTopic;
    public childTopics?: RotationTopic[] = [];
    public references?: RotationReference[] = [];
    public checked: boolean = false;
    public editing: boolean = false;
}
