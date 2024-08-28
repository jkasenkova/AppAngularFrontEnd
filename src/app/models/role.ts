import { Guid } from "guid-typescript";
import { UserType } from "./userType";
import { RotationType } from "../features/admin-panel/user-orientation/model/rotationType";
import { ShiftPatternType } from "./shiftPatternType";

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