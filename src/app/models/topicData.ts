import { Observable } from "rxjs";
import { TemplateTopic } from "./templateTopic";
import { Reference } from "./reference";
import { Guid } from "guid-typescript";

export interface TopicData {
    sectionId?: Guid;
    topicId: Guid;
    topic?: TemplateTopic;
    topicName: string;
    referenceName: string;
    reference: Reference;
    referenceId?: Guid;
    template: Observable<string>;
    section?: string;
    description?: string;
}
