import { Guid } from "guid-typescript";
import { UserType } from "./userType";
import { ShiftPatternType } from "./shiftPatternType";
import { RotationType } from "./rotationType";

export class RoleModel {
    id?: Guid;
    name: string;
    templateId?: Guid;
    userType: UserType;
    teamId: Guid;
    rotationType: RotationType;
    shiftPatternType?: ShiftPatternType;
}