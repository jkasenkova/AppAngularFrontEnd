import { Guid } from 'guid-typescript';
import { MyTeamModel } from 'src/app/models/myTeamModel';

export class ShareReportModel {
    ownerId: Guid;
    handoverId: Guid;
    shareUsers: MyTeamModel[] = [];
    shareEmails: string[] = []
    teamMembers: MyTeamModel[];
}
