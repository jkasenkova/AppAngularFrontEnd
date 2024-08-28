import { Guid } from "guid-typescript";
import { UserType } from "./userType";

export interface RoleModel {
    roleId?: Guid;
    roleName: string;
    locationId: Guid;
    templateId?: Guid;
    userType: UserType;
    teamId: Guid;
}