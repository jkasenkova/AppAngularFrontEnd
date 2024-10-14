import { Guid } from "guid-typescript";
import { RotationTopic } from "./rotationTopic";

export class RotationReference {
    public id!: Guid;
    public rotationTopicId?: Guid;
    public rotationTopic?: RotationTopic;
    public name!: string;
    public description?: string;
    public enabled: boolean = false;
    public index: number = 0;
    public editing: boolean = false;
    public parentReferenceId?: string;
    public childReferences?: RotationReference[];
}