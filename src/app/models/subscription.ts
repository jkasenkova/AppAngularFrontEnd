import { SubscriptionStatus } from "./subscriptionStatus";

export class Subscription {
    public id: string;
    public timeZoneId: string;
    public status: SubscriptionStatus;
    public createdDate: string;
    public limitUsers: string;
    public activeHandovers: string;
    public email: string;
    public adminId: string;
}