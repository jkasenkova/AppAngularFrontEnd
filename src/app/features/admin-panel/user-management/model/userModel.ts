import { Guid } from "guid-typescript";
import { RoleModel } from "src/app/models/role";
import { RotationType } from "src/app/models/rotationType";
import { Team } from "src/app/models/team";
import { UserType } from "src/app/models/userType";

export interface UserModel {
    userId?: Guid;
    userName: string;
    userSurname?: string;
    email: string;
    password: string;
    roleId: Guid;
    teamId: Guid;
    locationId?: Guid;
    lineManagerId?: Guid;
    contributors?: UserModel[];
    lineManagers?: UserModel[];
    roles?: RoleModel[];
    teams?: Team[]; 
    recipients?: UserModel[];
    userType?: UserType;
    rotation?: RotationType;
    lastLogin?: number;
}
