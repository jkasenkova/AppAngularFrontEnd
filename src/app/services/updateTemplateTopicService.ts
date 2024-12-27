import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateTopic } from '../models/templateTopic';

@Injectable({
  providedIn: 'root',
})
export class UpdateTemplateTopicService {
  private dataSubject = new BehaviorSubject<TemplateTopic[]>([]);
  data$ = this.dataSubject.asObservable();
  arrayChanged: EventEmitter<TemplateTopic[]> = new EventEmitter<TemplateTopic[]>();

  addItem(newItem: any): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData, newItem];
    this.dataSubject.next(updatedData);

    this.setData(updatedData);
  }

  updateItem(updatedItem: any): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData];
    let index = currentData.indexOf(updatedItem);
    updatedData[index] = updatedItem;
    this.dataSubject.next(updatedData);
    
    this.setData(updatedData);
  }

  deleteItem(deleteItem: any): void {
    const currentData = this.dataSubject.value;
    let index = currentData.findIndex(d => d.id === deleteItem.id);
    currentData.splice(index, 1);
    this.dataSubject.next(currentData);

    this.setData(currentData);
  }

  setData(data: any): void {
    this.arrayChanged.emit(data);
    this.dataSubject.next(data);
  }

  getData(): any {
    return this.dataSubject.getValue();
  }
}