import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Group, GroupMember } from '../models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private readonly apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  list(search = '', page = 1, limit = 20): Observable<{ groups: Group[]; total: number }> {
    return this.http.get<{ groups: Group[]; total: number }>(this.apiUrl, {
      params: { search, page, limit },
    });
  }

  getById(groupId: string): Observable<{ group: Group; memberCount: number; myRole: string | null }> {
    return this.http.get<{ group: Group; memberCount: number; myRole: string | null }>(
      `${this.apiUrl}/${groupId}`
    );
  }

  getMyGroups(): Observable<{ groups: (Group & { myRole: string })[] }> {
    return this.http.get<{ groups: (Group & { myRole: string })[] }>(`${this.apiUrl}/mine`);
  }

  create(payload: { name: string; description?: string }): Observable<{ group: Group }> {
    return this.http.post<{ group: Group }>(this.apiUrl, payload);
  }

  update(groupId: string, payload: { name?: string; description?: string }): Observable<{ group: Group }> {
    return this.http.put<{ group: Group }>(`${this.apiUrl}/${groupId}`, payload);
  }

  uploadLogo(groupId: string, file: File): Observable<{ group: Group }> {
    const form = new FormData();
    form.append('logo', file);
    return this.http.put<{ group: Group }>(`${this.apiUrl}/${groupId}/logo`, form);
  }

  uploadCover(groupId: string, file: File): Observable<{ group: Group }> {
    const form = new FormData();
    form.append('cover', file);
    return this.http.put<{ group: Group }>(`${this.apiUrl}/${groupId}/cover`, form);
  }

  delete(groupId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${groupId}`);
  }

  // --- Members ---
  join(groupId: string): Observable<{ membership: GroupMember }> {
    return this.http.post<{ membership: GroupMember }>(`${this.apiUrl}/${groupId}/members/join`, {});
  }

  leave(groupId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${groupId}/members/leave`);
  }

  listMembers(groupId: string): Observable<{ members: GroupMember[] }> {
    return this.http.get<{ members: GroupMember[] }>(`${this.apiUrl}/${groupId}/members`);
  }

  changeMemberRole(groupId: string, userId: string, role: 'admin' | 'member') {
    return this.http.patch<{ membership: GroupMember }>(
      `${this.apiUrl}/${groupId}/members/${userId}/role`,
      { role }
    );
  }

  removeMember(groupId: string, userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${groupId}/members/${userId}`);
  }
}
