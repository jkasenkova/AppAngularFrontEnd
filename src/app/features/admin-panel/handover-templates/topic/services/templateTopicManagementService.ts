import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateTopic } from '../../../../../models/templateTopic';
import { Guid } from 'guid-typescript';
import { Reference } from 'src/app/models/reference';

@Injectable({
  providedIn: 'root',
})
export class TemplateTopicManagementService {
  private dataSubject = new BehaviorSubject<TemplateTopic[]>([]);
  templateTopics$ = this.dataSubject.asObservable();
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

  addReference(topicId: Guid, reference: Reference): void {
    const currentData = this.dataSubject.value;

    const updatedData = [...currentData];

    var updatedItem = currentData.find(t => t.id === topicId);
    let index = currentData.indexOf(updatedItem);
    updatedData[index].templateReferences.push(reference);

    debugger;
    this.dataSubject.next(updatedData);
    this.setData(updatedData);
  }

  editReference(topicId: Guid, referenceEdit: Reference): void {
    const currentData = this.dataSubject.value;
    const updatedData = currentData.map(item =>
      item.id === topicId
        ? {
            ...item,
            subItems: item.templateReferences.map(reference =>
              reference.id === reference.id ? { ...reference, name: referenceEdit.name } : reference
            ),
          }
        : item
    );
    this.dataSubject.next(updatedData);
    this.setData(updatedData);
  }
}