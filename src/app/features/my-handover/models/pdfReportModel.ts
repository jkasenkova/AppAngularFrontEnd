import { Guid } from 'guid-typescript';
import { HandoverSection } from 'src/app/models/handoverSection';

export class pdfReportModel {
    handoverId: Guid;
    handoverDates: string;
    handoverType: string;
    handoverTimeZone: string;
    handoverOwner: string;
    handoverRecipient: string;
    handoverSharedReports?: string;
    handoverContributors?: string;
    handoverSections: HandoverSection[];
}
