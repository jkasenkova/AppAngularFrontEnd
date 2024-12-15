import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root',
})
export class UpdateTemplateService {
  private dataSubject = new BehaviorSubject<Template[]>([]);
  data$ = this.dataSubject.asObservable();

  addItem(newItem: any): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData, newItem];
    this.dataSubject.next(updatedData);
  }


  updateItem(index: number, updatedItem: any): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData];
    updatedData[index] = updatedItem;
    this.dataSubject.next(updatedData);
  }
}