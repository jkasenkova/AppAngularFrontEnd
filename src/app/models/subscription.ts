import { Guid } from "guid-typescript";
import { SubscriptionStatus } from "./subscriptionStatus";

export class Subscription {
    public id: Guid;
    public timeZoneId: string;
    public status: SubscriptionStatus;
    public createdDate: string;
    public limitUsers: string;
    public activeHandovers: string;
    public email: string;
    public adminId: Guid;
}