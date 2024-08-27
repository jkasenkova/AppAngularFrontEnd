import { Guid } from "guid-typescript";
import { RoleModel } from "src/app/models/role";
import { Team } from "src/app/models/team";

export interface UserModel {
    userId?: Guid;
    userName: string;
    userSurname: string;
    email: string;
    password: string;
    roleId: Guid;
    teamId: Guid;
    lineManagerId: Guid;
    contributors?: UserModel[];
    lineManagers?: UserModel[];
    roles?: RoleModel[];
    teams?: Team[]; 
}
