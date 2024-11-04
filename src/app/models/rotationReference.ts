import { Guid } from "guid-typescript";
import { RotationTopic } from "./rotationTopic";

export class RotationReference {
    public id: Guid;
    public rotationTopicId?: Guid;
    public rotationTopic?: RotationTopic;
    public name: string;
    public description?: string;
    public enabled: boolean = false;
    public index: number = 0;
    public parentReferenceId?: string;
    public templateReference: boolean = false;
    public templateDescription?: string;
    public childReferences?: RotationReference[];
    public isPinned: boolean = false;
    public checked: boolean = false;
    public editing: boolean = false;
    public expand: boolean = false;
}
