import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    constructor() { }

    setItem(key: string, value: any): void {
        const jsonData = JSON.stringify(value);
        sessionStorage.setItem(key, jsonData);
    }

    getItem<T>(key: string): T | null {
        const jsonData = sessionStorage.getItem(key);
        if (jsonData) {
            return JSON.parse(jsonData) as T;
        }
        return null;
    }

    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    clear(): void {
        sessionStorage.clear();
    }
}