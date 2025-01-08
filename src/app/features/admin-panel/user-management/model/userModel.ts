import { RoleModel } from '@models/role';
import { RotationType } from '@models/rotationType';
import { Team } from '@models/team';
import { UserType } from '@models/userType';

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
