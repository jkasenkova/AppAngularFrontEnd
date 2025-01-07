import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoleModel } from 'src/app/models/role';

@Injectable({
  providedIn: 'root',
})

export class RoleManagementService {
  private rolesSubject: BehaviorSubject<RoleModel[]> = new BehaviorSubject<RoleModel[]>([]);
  roles$: Observable<RoleModel[]> = this.rolesSubject.asObservable();

  addRole(newRole: RoleModel): void {
    const currentRoles = this.rolesSubject.value;
    const updatedRoles = [...currentRoles, newRole];
    updatedRoles.sort((a, b) => a.name.localeCompare(b.name));
    this.rolesSubject.next(updatedRoles);
  }

  deleteRole(roleId: Guid): void {
    const currentRoles = this.rolesSubject.value;
    const updatedRoles = currentRoles.filter((role) => role.id !== roleId);
    this.rolesSubject.next(updatedRoles);
  }

  updateRole(updatedRole: RoleModel): void {
    const currentRoles = this.rolesSubject.value;
    const updatedRoles = currentRoles.map((role) =>
        role.id === updatedRole.id ? updatedRole : role
    );
    updatedRoles.sort((a, b) => a.name.localeCompare(b.name));
    this.rolesSubject.next(updatedRoles);
  }

  setData(data: RoleModel[]): RoleModel[] {
    this.rolesSubject.next(data);
    return this.rolesSubject.value;
  }
}