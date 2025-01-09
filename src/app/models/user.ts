export class UserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId?: string;
    teamId?: string;
    lineManagerId?: string;
    companyId: string;
    currentRotationId?: string;
    title?: string;
}