import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root',
})
export class UpdateTemplateService {
  private dataSubject = new BehaviorSubject<Template[]>([]);
  data$ = this.dataSubject.asObservable();
  arrayChanged: EventEmitter<Template[]> = new EventEmitter<Template[]>();

  addItem(newItem: any): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData, newItem];
    this.dataSubject.next(updatedData);

    this.setData(updatedData);
  }

  updateArray(newArray: Template[]): void {
    const currentData = this.dataSubject.value;
    this.arrayChanged.emit(newArray);
  }


  updateItem(index: number, updatedItem: any): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData];
    updatedData[index] = updatedItem;
    this.dataSubject.next(updatedData);

    this.setData(updatedData);
  }

  deleteItem(deleteItem: any): void {
    const currentData = this.dataSubject.value;
    var updatedData = currentData.filter(d => d.id != deleteItem.id);
    this.dataSubject.next(updatedData);

    this.setData(updatedData);
  }

  setData(data: any): void {
    this.dataSubject.next(data);
    this.arrayChanged.emit(data);
  }

  getData(): any {
    return this.dataSubject.getValue();
  }
}