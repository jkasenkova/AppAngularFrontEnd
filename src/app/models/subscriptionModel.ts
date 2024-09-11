import { Guid } from "guid-typescript";

export class SubscriptionModel {
    public version: string;
    public purchaseDate: string;
    public billingDate: string;
    public planType: string;
    public timeZoneId: Guid;
    public templatesLimit: number;
    public users: string;
}