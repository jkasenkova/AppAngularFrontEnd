import { Guid } from "guid-typescript";
import { UserType } from "./userType";
import { ShiftPatternType } from "./shiftPatternType";
import { RotationType } from "./rotationType";

export interface RoleModel {
    roleId?: Guid;
    roleName: string;
    locationId: Guid;
    templateId?: Guid;
    userType: UserType;
    teamId: Guid;
    rotationType: RotationType;
    shiftPatternType?: ShiftPatternType;
}