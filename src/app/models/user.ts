import { Guid } from "guid-typescript";

export class UserModel {
    id?: Guid;
    name: string = '';
    surname?: string;
    email: string = '';
    roleId: Guid;
    teamId: Guid;
    companyId: Guid;
    currentRotationId?: Guid;
    password?: string;
    title?: string;
}