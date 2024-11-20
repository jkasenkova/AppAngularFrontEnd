import { Guid } from 'guid-typescript';

export class pdfReportModel {
    handoverId: Guid;
    handoverDates: string;
    handoverType: string;
    handoverTimeZone: string;
    handoverOwner: string;
    handoverRecipient: string;
    handoverSharedReports?: string;
    handoverContributors?: string;
}
