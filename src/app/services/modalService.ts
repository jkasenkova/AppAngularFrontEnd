import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private _isOpen = new BehaviorSubject<boolean>(false);
    isOpen = this._isOpen.asObservable();

    constructor() { }

    open(): void {
        this._isOpen.next(true);
    }

    close(): void {
        this._isOpen.next(false);
    }
}