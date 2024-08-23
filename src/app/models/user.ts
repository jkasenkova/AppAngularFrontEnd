import { Guid } from "guid-typescript";

export interface UserModel {
    userId?: Guid;
    userName: string;
    userSurname?: Guid;
    email: string;
    password: string;
    roleId: Guid;
    teamId: Guid;
    companyId: Guid;
    currentRotationId?: Guid;
}