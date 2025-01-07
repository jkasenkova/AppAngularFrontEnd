import { UserType } from "./userType";
import { ShiftPatternType } from "./shiftPatternType";
import { RotationType } from "./rotationType";

export class RoleModel {
    id?: string;
    name: string;
    templateId?: string;
    userType: UserType;
    teamId: string;
    rotationType: RotationType;
    shiftPatternType?: ShiftPatternType;
}