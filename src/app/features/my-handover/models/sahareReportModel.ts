import { Guid } from 'guid-typescript';
import { UserModel } from 'src/app/models/user';

export class ShareReportModel {
    ownerId: Guid;
    handoverId: Guid;
    shareUsers: UserModel[] = [];
    shareEmails: string[] = []
    teamMembers?: UserModel[];
}
