import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RotationTopic } from 'src/app/models/rotationTopic';

@Injectable({
  providedIn: 'root',
})
export class TopicManagementService {
  private dataSubject = new BehaviorSubject<RotationTopic[]>([]);
  topics$ = this.dataSubject.asObservable();
  arrayChanged: EventEmitter<RotationTopic[]> = new EventEmitter<RotationTopic[]>();

  addTopic(newTopic: RotationTopic): void {
    const currentData = this.dataSubject.value;
    const updatedData = [...currentData, newTopic];
    this.dataSubject.next(updatedData);
  }

  updateTopic(updatedTopic: RotationTopic): void {
    const updatedTopics = this.dataSubject.value.map(topic =>
        topic.id === updatedTopic.id ? { ...topic, name: updatedTopic.name } : topic
    );
    updatedTopics.sort((a, b) => a.name.localeCompare(b.name));
    this.dataSubject.next(updatedTopics);
  }

  deleteTopic(deleteTopic: RotationTopic): void {
    const currentData = this.dataSubject.value;
    var updatedData = currentData.filter(d => d.id != deleteTopic.id);
    this.dataSubject.next(updatedData);
  }

  setData(data: RotationTopic[]): void {
    this.dataSubject.next(data);
  }

  updateData(data: RotationTopic[]):void {
    this.dataSubject.next(data);
    this.arrayChanged.emit(data);
  }

  getData(): RotationTopic[] {
    return this.dataSubject.getValue();
  }
}