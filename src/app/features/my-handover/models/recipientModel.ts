import { UserModel } from "src/app/models/user";

export class RecipientModel{
    public users: UserModel[];
    public recipientId: string;
    public handoverId: string;
}