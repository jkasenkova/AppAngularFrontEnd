import { Guid } from 'guid-typescript';

export interface AccountModel {
    id: Guid;
    name: string;
    timezone: string;
}