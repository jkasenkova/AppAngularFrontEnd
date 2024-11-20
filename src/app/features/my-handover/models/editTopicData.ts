import { Guid } from 'guid-typescript';

export class EditTopicDataModel {
    topicId?: Guid;
    topicName?: string;
    referenceId?: Guid;
    referenceName?: string;
    referenceNotes?: string;
}
