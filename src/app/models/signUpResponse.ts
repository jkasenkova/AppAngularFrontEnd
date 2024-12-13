import { Guid } from 'guid-typescript';

export interface SignUpResponse {
    error: string;
    companyId: Guid;
    companyName: string;
    succeeded: boolean;
}