import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateTopic } from '../models/templateTopic';

@Injectable({
  providedIn: 'root',
})
export class UpdateTemplateTopicService {
  private dataSubject = new BehaviorSubject<TemplateTopic[]>([]);
  data$ = this.dataSubject.asObservable();

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
  }

  deleteItem(deleteItem: any): void {
    const currentData = this.dataSubject.value;
    var updatedData = currentData.filter(d => d.id != deleteItem.id);
    this.dataSubject.next(updatedData);
  }

  setData(data: any): void {
    const currentData = this.dataSubject.value;
    this.dataSubject.next(data);
  }

  getData(): any {
    return this.dataSubject.getValue();
  }
}