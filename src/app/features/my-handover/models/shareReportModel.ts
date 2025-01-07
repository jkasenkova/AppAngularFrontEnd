import { MyTeamModel } from 'src/app/models/myTeamModel';

export class ShareReportModel {
    ownerId: string;
    handoverId: string;
    shareUsers: MyTeamModel[] = [];
    shareEmails: string[] = []
    teamMembers: MyTeamModel[];
}
