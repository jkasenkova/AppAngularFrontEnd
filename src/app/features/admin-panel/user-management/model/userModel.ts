import { RoleModel } from "src/app/models/role";
import { RotationType } from "src/app/models/rotationType";
import { Team } from "src/app/models/team";
import { UserType } from "src/app/models/userType";

export interface UserModel {
    userId?: string;
    firstName: string;
    lastName?: string;
    email: string;
    roleId: string;
    teamId: string;
    locationId?: string;
    lineManagerId?: string;
    contributors?: UserModel[];
    lineManagers?: UserModel[];
    roles?: RoleModel[];
    teams?: Team[]; 
    recipients?: UserModel[];
    userType?: UserType;
    rotation?: RotationType;
    lastLogin?: number;
}
