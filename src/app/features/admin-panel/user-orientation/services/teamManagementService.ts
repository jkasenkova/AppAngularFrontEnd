import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from 'src/app/models/team';

@Injectable({
  providedIn: 'root',
})

export class TeamManagementService {
  private teamsSubject: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>([]);
  teams$: Observable<Team[]> = this.teamsSubject.asObservable();

  addTeam(newTeam: Team): void {
    const currentTeams = this.teamsSubject.value;
    const updatedTeams = [...currentTeams, newTeam];
    updatedTeams.sort((a, b) => a.name.localeCompare(b.name));
    this.teamsSubject.next(updatedTeams);

    this.setData(updatedTeams);
  }

  deleteTeam(itemId: Guid): void {
    const currentTeams = this.teamsSubject.value;
    const updatedTeams = currentTeams.filter((team) => team.id !== itemId);
    this.teamsSubject.next(updatedTeams);

    this.setData(updatedTeams);
  }

  updateTeam(updatedTeam: Team) {
    const currentTeams = this.teamsSubject.value;
    const updatedTeams = [...currentTeams];
    let index = currentTeams.indexOf(updatedTeam);
    updatedTeams[index] = updatedTeam;
    this.teamsSubject.next(updatedTeams);

    updatedTeams.sort((a, b) => a.name.localeCompare(b.name));
    this.teamsSubject.next(updatedTeams);

    this.setData(updatedTeams);
  }

  setData(data: Team[]): Team[] {
    this.teamsSubject.next(data);
    return this.teamsSubject.value;
  }
}