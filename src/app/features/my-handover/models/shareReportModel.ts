import { UserModel } from 'src/app/models/user';

export class ShareReportModel {
    ownerId: string;
    handoverId: string;
    shareUsers: UserModel[] = [];
    shareEmails: string[] = []
    teamMembers?: UserModel[];
}
