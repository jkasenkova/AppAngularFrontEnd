import { Guid } from "guid-typescript";

export class UserModel {
    userId?: Guid;
    userName: string = '';
    userSurname?: string;
    email: string = '';
    password: string = '';
    roleId: Guid;
    teamId: Guid;
    lineManagerId?: Guid;
    companyId: Guid;
    currentRotationId?: Guid;
    title?: string;
}