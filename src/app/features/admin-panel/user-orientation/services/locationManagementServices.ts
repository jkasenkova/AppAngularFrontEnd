import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from "src/app/models/location";

@Injectable({
  providedIn: 'root',
})

export class LocationManagementService {
  private locationsSubject: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([]);
  locations$: Observable<Location[]> = this.locationsSubject.asObservable();

  addLocation(newLocation: Location): void {
    const currentLocations = this.locationsSubject.value;
    const updatedLocations = [...currentLocations, newLocation];
    updatedLocations.sort((a, b) => a.name.localeCompare(b.name));
    this.locationsSubject.next(updatedLocations);
  }

  deleteLocation(locationId: string): void {
    const currentLocations = this.locationsSubject.value;
    const updatedLocations = currentLocations.filter((location) => location.id !== locationId);
    this.locationsSubject.next(updatedLocations);
  }

  updateLocation(updatedLocation: Location): void {
    const updatedLocations = this.locationsSubject.value.map(location =>
      location.id === updatedLocation.id ? { ...location, name: updatedLocation.name } : location
    );
    updatedLocations.sort((a, b) => a.name.localeCompare(b.name));
    this.locationsSubject.next(updatedLocations);
  }

  setData(data: Location[]): Location[] {
    this.locationsSubject.next(data);
    return this.locationsSubject.getValue();
  }

  getData():  Observable<Location[]> {
    return this.locationsSubject; 
  }

}