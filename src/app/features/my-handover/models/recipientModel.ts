import { Guid } from "guid-typescript";
import { UserModel } from "src/app/models/user";

export class RecipientModel{
    public users: UserModel[];
    public recipientId: Guid;
    public handoverId: Guid;
}