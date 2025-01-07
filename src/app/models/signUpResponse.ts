export interface SignUpResponse {
    error?: string;
    companyId?: string;
    userId?: string;
    roleId?: string;
    companyName?: string;
    succeeded: boolean;
}