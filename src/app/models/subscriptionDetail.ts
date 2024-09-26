import { Guid } from "guid-typescript";

export class SubscriptionDetail {
    public version: string;
    public purchaseDate: string;
    public billingDate: string;
    public planType: string;
    public timeZoneId: string;
    public templatesLimit: number;
    public users: string;
}